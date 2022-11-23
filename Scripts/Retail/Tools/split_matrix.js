//tool to split matrix from color/size to separate colors with sizes
//indescriminate of matrix type, but will only work with 2 attribut matrices and will always split the first attribute into Size matrices with the first attribute in the name.
// watch weird names in the pricing rules
(()=>{
// ------------------- declaring variables
	window.success_list = {};
	window.fail_list = [];
	let to_do_list = [],
		//start_time = Date.now(),
		//fullspeed = 'true',
		//pitstop,
		rad_id = window.merchantos.account.id,
		attr = "@attributes",
		base_url = `${window.origin}/API/Account/${rad_id}/`,
		currentpage,
		donecount = count = start_id = offset = newmatrixid = 0;
	location.search.split('&').forEach((l) => {
		if(l.match('id=')) currentpage = l.replace('id=','');
		if(to_do_list.length==0) to_do_list.push(currentpage);
	});
	window.alert('You are about to split up this (list of) matrices. ARE YOU SURE? this action is not reversible. Before continuing, make sure the price levels do not have any weird characters in them, otherwise the creation of new matrices will fail.')
// ------------------- get matrix data (later get all and loop)
	to_do_list.forEach((item,i) => {
		/**/console.log('init '+item,i,'matrices done out of',to_do_list.length);
		$.ajax({
			type: 'GET',
			url: base_url+'ItemMatrix.json?load_relations=["ItemAttributeSet","Items"]&itemAttributeSetID=1&itemMatrixID='+item,
			dataType: 'JSON',
			async: false,
			success: (old, textStatus, jqXHR) => {
				oldmatrix = old.ItemMatrix;
				/**/console.log('------------------- \n',oldmatrix);
				// ------------------- remove all items from old matrix
				oldmatrix.Items.Item.forEach((matrixItem) => {
					$.get({
						url:`${window.origin}/ajax_forms.php?ajax=1&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"item_group.listings.edit_items_individually","is_child_list":"1","display_search":"0","saved_search":{"item_group_id":"${oldmatrix.itemMatrixID}"},"tab":"single","title":"Items","deleted_rows":null,"row_num":0,"rec_num":1}&fnc=remove_group_item&key_values={"item_group_id":"${oldmatrix.itemMatrixID}"}&row={"is_blank_attribute1":0,"is_blank_attribute2":0,"item_id":${matrixItem.itemID},"item_group_id":${oldmatrix.itemMatrixID}}&selected_records=[]&pannel_id=item_group_listings_edit_items_individually_view`, success: (data, textStatus, jqXHR) => {data.success?/**/console.log(matrixItem.itemID, data.success_msg, data):/**/console.log('failed', matrixItem);}, dataType: 'JSON', async: false});
				});
				// ------------------- loop through colors (/first attribute) to create new matrices based on attribute names
				oldmatrix.attribute1Values.forEach((color) => {
					let new_color_matrix_data = {
						'description': oldmatrix.description+' '+color,
						'defaultCost': oldmatrix.defaultCost,
						'itemAttributeSetID': '2',
						'ItemAttributeSet': {
							'itemAttributeSetID': '2',
							'name': 'Size',
							'attributeName1': '',
							'attributeName2': 'Size',
							'attributeName3': ''
						},
						'Prices': oldmatrix.Prices,
					}
					// ------------------- create new matrix for each color
					$.ajax({
						type: 'POST',
						url: base_url+'ItemMatrix.json',
						data: JSON.stringify(new_color_matrix_data),
						dataType: 'JSON',
						async: false,
						success: (nw, textStatus, jqXHR) => {
							newmatrixid = nw.ItemMatrix.itemMatrixID;
						}
					}).done(()=>{
						// ------------------- loop through existing items to check which need to go in just created color
						oldmatrix.Items.Item.forEach((matrixItem) => {
							if (matrixItem.description.match(color)){
								let Size = matrixItem.description.split(color)[matrixItem.description.split(color).length-1].trim();
								/**/console.log('item "'+matrixItem.description+'" matches: '+color, 'Size this item: '+Size);
								let settings = {
									type: 'PUT',
									async: false,
									url: `${base_url}Item/${matrixItem.itemID}.json`,
									data: `{
										"itemMatrixID":"${newmatrixid}",
										"ItemAttributes": {
											"itemAttributeSetID": "2",
											"attribute1": "",
											"attribute2": "${Size}"
										}
									}`,
									dataType: 'JSON',
									success: (res, textStatus, jqXHR) => {
										console.log(textStatus, matrixItem.itemID , res);
									},
									error: (res, textStatus, jqXHR) => {
										console.log(textStatus, matrixItem.itemID, res, jqXHR, settings.data);
									}
								}
								$.ajax(settings);
							}
						});	
					});
				})
				$.ajax({
					type: 'DELETE',
					url: base_url+'ItemMatrix/'+item+'.json',
					dataType: 'JSON',
					success: function (response) {
						/**/console.log('Old matrix '+item+' archived');
					}
				});
			},
			error: (res, textStatus, jqXHR) => {
				window.alert('Please log in again');
			}
		});
	})
})();