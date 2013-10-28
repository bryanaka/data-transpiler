(function($, window, document, undefined) {

	// String Helper Functions

	// trims whitespace
	if (!String.prototype.trim) {
		string.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	// sets string to underscored/snake_casing
	function underscored(string) {
		return string.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	}

	// replaces dash-cashing/underscored/snake_casing with spaces 
	function space_out(string) {
		string = String(string);
		return string.trim().replace(/[-_]/g, ' ');
	}

	// capitalizes all first letters of every word
	function capitalize(string) {
		string = string.trim().replace(/[\s-_]+[a-z]/g, function(match, c) {
			return match.replace(/[-_]/g, ' ').toUpperCase();
		});
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// if a string is a number, coerce the number
	function coerceNumber(num) {
		if(!isNaN(num)) { num = +num; }
		return num;
	}
	
	// Table Helper Functions
	
	/*
	** @param $el:      any valid jquery selector
	** @param modifier: any function that modifies and returns a string
	** @return          array of keys created from the 'th' elements found
	*/
	function getTableKeys($el, modifier) {
		var keys = $el.find('th').map(function(index, val) {
			return (typeof modifier !== 'undefined' ? modifier.call(this, val.innerText) : val.innerText);
		});
		return $.makeArray(keys);
	}

	/*
	** @param $el: any valid jquery selector
	** @return     an array of strings inside of each 'td' element cell
	*/
	function getTableData($el) {
		return $el.find('td').map(function(index, val) {
			return val.innerText;
		});
	}

	// JSON Helper Functions

	/*
	** @param collection: an array of objects (collection) or an object
	** @return      an array of all posible keys 
	*/
	function filterKeys(collection) {
		var keys = [],
			key,
			objCount = collection.length;

		if( $.isArray(collection) ) {
			for (n = 0; n < objCount; n++) {
				for (key in collection[n]) {
					if( !$.inArray(key) || n === 0 ) {
						keys.push(key);
					}
				}
			}
		} else {
			for (key in collection) { keys.push(key); }
		}
		return keys;
	}

	// CSV Helper Functions

	function trimQuotes(string) {
		return string.replace(/(^[\"\']|[\"\']$)/g, "");
	}

	function getCSVKeys(csvRow, modifier) {
		return $.map(csvRow.split(','), function(val, index) {
			if(typeof modifier !== 'undefined') {
				return modifier.call( this, trimQuotes(val) );
			} else {
				return trimQuotes(val);
			}
		});
	}

	// Public API

	function tableToJSON() {
		var keys       = getTableKeys(this, underscored),
			data       = getTableData(this),
			collection = [],
			i = 0,
			n, obj;

		while(i < data.length) {
			obj = {};
			for(n = 0; n < keys.length; n++) {
				data[i] = coerceNumber(data[i]);
				obj[keys[n]] = data[i];
				i++;
			}
			collection.push(obj);
		}
		return { "data": collection };
	}

	function tableToCSV() {
		var keys      = getTableKeys(this),
			data      = getTableData(this),
			i = 0,
			csv, n;

		csv ='"'+keys.join('\",\"') + '"\n';
		while(i < data.length) {
			for(n = 0; n < keys.length; n++) {
				csv += '"'+data[i]+'",';
				i++;
			}
			csv = csv.replace(/(,\s*$)/g, '') + '\n';
		}
		return csv;
	}

	function JSONToTable(json) {
		var keys = filterKeys(json),
			headers,
			tableBody,
			table,
			i, m, k;

		// headers
		headers = '<thead><tr>';
		for (i = 0; i < keys.length; i++) {
			headers += '<th>' + space_out(keys[i]) + '</th>';
		}
		headers += '</tr></thead>';

		// data
		tableBody = '<tbody>';
		for (m=0; m < json.length; m++) {
			tableBody += '<tr>';
			// check if object has the corresponding key-value pair for the current header
			for (k = 0; k < keys.length; k++) {
				if ( json[m].hasOwnProperty(keys[k]) ) {
					tableBody += '<td>' + json[m][keys[k]] + '</td>';
				} else {
					tableBody += '<td></td>';
				}
			}
			tableBody += '</tr>';
		}
		tableBody += '</tbody>';

		return '<table>' + headers + tableBody + '</table>';
	}

	function JSONToCSV(json) {
		var keys = filterKeys(json),
			csv, m, n;
		if( !$.isArray(json) ) { json = [json]; }

		csv = '"' + $.map(keys, function(val, index) { return space_out(val); }).join('\",\"') + '"\n';

		for (m=0; m < json.length; m++) {

			for (n = 0; n < keys.length; n++) {
				if ( json[m].hasOwnProperty(keys[n]) ) {
					csv += '"' + json[m][keys[n]] + '",';
				} else {
					csv += '"",';
				}
			}

			csv = csv.replace(/(,\s*$)/g, '') + '\n';
		}
		return csv;
	}

	function CSVToJSON(csv) {
		var csvRows    = csv.split('\n'),
			keys       = getCSVKeys(csvRows[0], underscored),
			rowCount   = csvRows.length -1,
			collection = [],
			obj, m, n;

		for (m = 1; m < rowCount; m++) {
			obj = {};
			for (n = 0; n < keys.length; n++) {
				var dataVal = trimQuotes(csvRows[m].split(',')[n]);
				obj[keys[n]] = coerceNumber(dataVal);
			}
			collection.push(obj);
		}

		return { data: collection };
	}

	function CSVToTable(csv) {
		var csvRows  = csv.split('\n'),
			rowCount = csvRows.length -1,
			keys     = getCSVKeys(csvRows[0]),
			tableBody,
			cells;
		var i, m, k;

		table = '<table>';

		// headers
		headers = '<thead><tr>';
		for (i = 0; i < keys.length; i++) {
			headers += '<th>' + keys[i] + '</th>';
		}
		headers += '</tr></thead>';

		tableBody = '<tbody>';
		for (m=1; m < rowCount; m++) {
			tableBody += '<tr>';
			cells = csvRows[m].split(',');
			cells = $.map(cells, function(val, index) { return trimQuotes(val); });

			for (k = 0; k < keys.length; k++) {
				var dataVal = cells[k];
				tableBody += '<td>' + dataVal + '</td>';
			}
			tableBody += '</tr>';
		}
		tableBody += '</tbody>';

		table += headers + tableBody + '</table>';

		return table;

	}

	$.fn.tableToJSON = tableToJSON;
	$.fn.tableToCSV  = tableToCSV;

	// utilities
	$.JSONToTable = JSONToTable;
	$.JSONToCSV   = JSONToCSV;
	$.CSVToJSON   = CSVToJSON;
	$.CSVToTable  = CSVToTable;


})(jQuery, window, document);