<?php

class modelmysql
{

    public $server = null;

    public function setServer($server){
        $this->server = $server;
    }

    /*
     * End edit
     */

    private $con = false;               // Checks to see if the connection is active
    private $result = array();          // Results that are returned from the query

    /*
     * Connects to the database, only one connection
     * allowed
     */
    public function connect()
    {
        if(is_null($this->server))
        {
            $db['host']     = 'localhost';          // Database Host
            $db['db_user']  = 'root';     // Username
            $db['db_pass']  = 'Amsterdam1987';   // Password
            $db['db_name']  = 'lightspeed';
        }

        $this->db_name =  $db['db_name'];


        if(!$this->con)
        {
            $myconn = mysql_connect($db['host'],$db['db_user'], $db['db_pass']);
            if($myconn)
            {
                $seldb = mysql_select_db($db['db_name'],$myconn);
                if($seldb)
                {
                    $this->con = true;
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    }

    /*
    * Changes the new database, sets all current results
    * to null
    */
    public function setDatabase($name)
    {
        if($this->con)
        {
            if(@mysql_close())
            {
                $this->con = false;
                $this->results = null;
                $this->db_name = $name;
                $this->connect();
            }
        }

    }

    /*
    * Checks to see if the table exists when performing
    * queries
    */
    private function tableExists($table)
    {
        $tablesInDb = @mysql_query('SHOW TABLES FROM '.$this->db_name.' LIKE "'.$table.'"');

        if($tablesInDb)
        {
            if(mysql_num_rows($tablesInDb)==1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    /*
    * Selects information from the database.
    * Required: table (the name of the table)
    * Optional: rows (the columns requested, separated by commas)
    *           where (column = value as a string)
    *           order (column DIRECTION as a string)
    */
    public function select($table, $rows = '*', $where = null, $order = null, $limit = null)
    {

        global $ExecutedQueries;
        
        $q = 'SELECT '.$rows.' FROM '.$table;
        if($where != null)
            $q .= ' WHERE '.$where;
        if($order != null)
            $q .= ' ORDER BY '.$order;
        if($limit != null)
            $q .= ' LIMIT '.$limit;
        if(MYSQL_VISIBLE == true){echo  "<b>SELECT:</b>".$q."<br />\n";}
        $ExecutedQueries[] = $q;
        $query = mysql_query($q);
        if($query)
        {
            $this->numResults = mysql_num_rows($query);
            if($this->numResults == 0)
            {
            	return false;
            }
            else
            {
	            for($i = 0; $i < $this->numResults; $i++)
	            {
	                $r = mysql_fetch_array($query);
	                $key = array_keys($r);
	                for($x = 0; $x < count($key); $x++)
	                {
	                    // Sanitizes keys so only alphavalues are allowed
	                    if(!is_int($key[$x]))
	                    {
	                        if(mysql_num_rows($query) > 1)
	                            $this->result[$i][$key[$x]] = $r[$key[$x]];
	                        else if(mysql_num_rows($query) < 1)
	                            $this->result = null;
	                        else
	                            $this->result[$key[$x]] = $r[$key[$x]];
	                    }
	                }
	            }	
            }
            return true;
        }
        else
        {
            return false;
        }
    }

    /*
    * Insert values into the table
    * Required: table (the name of the table)
    *           values (the values to be inserted)
    * Optional: rows (if values don't match the number of rows)
    */
    public function insert($table,$values,$rows = null)
    {
        if($this->tableExists($table))
        {
            global $ExecutedQueries;

            $insert = 'INSERT INTO '.$table;
            if($rows != null)
            {
                $insert .= ' ('.$rows.')';
            }

            for($i = 0; $i < count($values); $i++)
            {
                if(is_string($values[$i])) {
                    $values[$i] = '"' . $values[$i] . '"';
                }elseif(empty($values[$i])){
                    $values[$i] = null;
                }
            }

            $values = implode(',',$values);
            $insert .= ' VALUES ('.$values.')';
        	if(MYSQL_VISIBLE == true){echo "<b>INSERT:</b> ".$insert."<br />\n";}
            $ExecutedQueries[] = $insert;
            $ins = @mysql_query($insert);

            if($ins)
            {
            	$this->result = array('result'=>TRUE);
            }
            else
            {
				$this->result = array('result'=>FALSE);            	
            }
        }
    }

    /*
    * Deletes table or records where condition is true
    * Required: table (the name of the table)
    * Optional: where (condition [column =  value])
    */
    public function delete($table,$where = null)
    {
        if($this->tableExists($table))
        {
            global $ExecutedQueries;

            if($where == null)
            {
                $delete = 'DELETE '.$table;
            }
            else
            {
                $delete = 'DELETE FROM '.$table.' WHERE '.$where;
            }
	        if(MYSQL_VISIBLE == true){echo "<b>DELETE:</b> ".$delete." <br />\n";}
            $ExecutedQueries[] = $delete;
            $del = @mysql_query($delete);

            if($del)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    /*
     * Updates the database with the values sent
     * Required: table (the name of the table to be updated
     *           rows (the rows/values in a key/value array
     *           where (the row/condition in an array (row,condition) )
     */
    public function update($table,$rows,$where)
    {
        if($this->tableExists($table))
        {
            global $ExecutedQueries;

            $update = 'UPDATE '.$table.' SET ';
            $keys = array_keys($rows);
            for($i = 0; $i < count($rows); $i++)
            {
                if(is_string($rows[$keys[$i]])){
                    $update .= $keys[$i].'="'.mysql_real_escape_string($rows[$keys[$i]]).'"';
                }
                elseif(is_null($rows[$keys[$i]])){
                    $update .= $keys[$i].'= NULL';
                }
                else{
                    $update .= $keys[$i].'='.mysql_real_escape_string($rows[$keys[$i]]);
                }

                // Parse to add commas
                if($i != count($rows)-1)
                {
                    $update .= ',';
                }
            }
            $update .= ' WHERE '.$where;
            if(MYSQL_VISIBLE == true){echo  "<b>UPDATE:</b> ".$update."<br />\n";}
            $ExecutedQueries[] = $update;
            $query = @mysql_query($update);
            if($query)
            {
            	$this->result = array('result'=>TRUE);
            }
            else
            {
            	$this->result = array('result'=>FALSE);
            }
        }
        else
        {
        	$this->result = array('result'=>FALSE);
        }
    }
    
    /*
     * Counts the values in a database
     * Required: table (the name of the table to be updated
     *           where (the row/condition in an array (row,condition) )
     */
    public function count($table, $where = null)
    {
        global $ExecutedQueries;

    	$q = 'SELECT COUNT(0) AS aantal FROM '.$table;
		if($where != null)
		$q .= ' WHERE '.$where;
		if(MYSQL_VISIBLE == true){echo  "<b>COUNT:</b> ".$q."<br />\n";}
        $ExecutedQueries[] = $q;
        $query = @mysql_query($q);
		$this->result = mysql_result($query, 0, 'aantal');
    } 
    
    /*
     * Counts the values in a database
    * Required: table (the name of the table to be updated
            *           where (the row/condition in an array (row,condition) )
            */
    public function countDistinct($table, $cell = null, $where = null)
    {
        global $ExecutedQueries;

        $q = 'SELECT COUNT(DISTINCT '.$cell.') AS aantal FROM '.$table;
        if($where != null)
            $q .= ' WHERE '.$where;
        if(MYSQL_VISIBLE == true){echo  "<b>COUNTDISTINCT:</b> ".$q."<br />\n";}
        $ExecutedQueries[] = $q;
        $query = @mysql_query($q);
        $this->result = mysql_result($query, 0, 'aantal');
    }
        /*
     * Shows the columns within database
     * Required: table (the name of the table to be updated)
     */
    public function ColumnNames($table)
    {
    		$qe = "SELECT column_name FROM information_schema.columns WHERE table_name = '".mysql_real_escape_string($table)."'";
    		$Q = @mysql_query($qe);
    		if(MYSQL_VISIBLE == true){echo  "<b>SHOW COLUMNS:</b>".$qe."<br /> \n";}
    		$r = @mysql_fetch_array($Q);
    		$this->result = $r;
    }
    
    /*
    * Returns the result set
    */
    public function CustomSelect($select)
    {
        global $ExecutedQueries;

        if(MYSQL_VISIBLE == true){echo "<b>CUSTOMSELECT:</b> ".$select."<br />\n";}
        $ExecutedQueries[] = $select;
        $query = mysql_query($select);
    	if($query)
    	{
    		$this->numResults = @mysql_num_rows($query);
    		if($this->numResults == 0)
    		{
    			return false;
    		}
    		else
    		{
    			for($i = 0; $i < $this->numResults; $i++)
    			{
	    			$r = mysql_fetch_array($query);
	    			$key = array_keys($r);
	    			for($x = 0; $x < count($key); $x++)
	    			{
		    			// Sanitizes keys so only alphavalues are allowed
		    			if(!is_int($key[$x]))
		    			{
		    				if(mysql_num_rows($query) > 1)
		    					$this->result[$i][$key[$x]] = $r[$key[$x]];
		    				else if(mysql_num_rows($query) < 1)
		    					$this->result = null;
		    				else
		    					$this->result[$key[$x]] = $r[$key[$x]];
						}
	    			}
    			}
    		}
    		return true;
    	}
    	else
    	{
    		return false;
    	}
    }
    
    public function getResult()
    {
        return $this->result;
    }
}
?>