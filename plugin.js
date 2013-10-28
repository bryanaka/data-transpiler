(function($, window, document, undefined) {

	var defaults = {
		ignore: []
	};

	if (!String.prototype.trim) {
		string.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	function underscored(string) {
		return string.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
	}

	function space_out(string) {
		string = String(string);
		return string.trim().replace(/[-_]/g, ' ');
	}

	function capitalize(string) {
		string = string.trim().replace(/[\s-_]+[a-z]/g, function(match, c) {
			return c.toUpperCase();
		});
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function getKeys($el, modifier) {
		var keys = $el.find('th').map(function(index, val) {
			return (typeof modifier !== 'undefined' ? modifier.call(this, val.innerText) : val.innerText);
		});
		return $.makeArray(keys);
	}

	function getData($el) {
		return $el.find('td').map(function(index, val) {
			return val.innerText;
		});
	}

	function filterKeys(json) {
		var keys = [],
			key,
			objCount = json.length;

		if( $.isArray(json) ) {
			for (n = 0; n < objCount; n++) {
				for (key in json[n]) {
					if( !$.inArray(key) || n === 0 ) {
						keys.push(key);
					}
				}
			}
		} else {
			for (key in json) { keys.push(key); }
		}
		return keys;
	}

	function tableToJSON() {
		var keys      = getKeys(this, underscored),
			keyCount  = keys.length,
			data      = getData(this),
			dataCount = data.length,
			collection = [],
			i = 0;

		while(i < dataCount) {
			var obj = {};
			// can probably use array.slice here?
			for(var n = 0; n < keyCount; n++) {
				if(!isNaN(data[i])) { data[i] = +data[i]; }
				obj[keys[n]] = data[i];
				i++;
			}
			collection.push(obj);
		}
		return { "data": collection };
	}

	function tableToCSV() {
		var keys      = getKeys(this),
			keyCount  = keys.length,
			data      = getData(this),
			dataCount = data.length,
			csv       = '',
			i = 0;

		csv ='"'+keys.join('\",\"') + '"\n';
		while(i < dataCount) {
			for(var n = 0; n < keyCount; n++) {
				csv += '"'+data[i]+'",';
				i++;
			}
			csv = csv.replace(/(,\s*$)/g, '') + '\n';
		}
		return csv;
	}

	function JSONToTable(json) {
		var keys = filterKeys(json),
			key,
			keyCount = keys.length,
			headers,
			data,
			rowCount = json.length,
			table,
			i, n, m, k;


		table = '<table>';

		// headers
		headers = '<thead><tr>';
		for (i = 0; i < keyCount; i++) {
			headers += '<th>' + space_out(keys[i]) + '</th>';
		}
		headers += '</tr></thead>';

		// data
		cellData = '<tbody>';
		for (m=0; m < rowCount; m++) {
			cellData += '<tr>';
			// check if object has the corresponding key-value pair for the current header
			for (k = 0; k < keyCount; k++) {
				if ( json[m].hasOwnProperty(keys[k]) ) {
					cellData += '<td>' + json[m][keys[k]] + '</td>';
				} else {
					cellData += '<td></td>';
				}
			}
			cellData += '</tr>';
		}
		cellData += '</tbody>';

		table += headers + cellData + '</table>';

		return table;
	}

	function JSONToCSV(json) {
		var keys = filterKeys(json),
			keyCount = keys.length,
			rowCount = json.length,
			csv, m, k;

		csv = '"' + $.map(keys, function(val, index) { return space_out(val); }).join('\",\"') + '"\n';

		for (m=0; m < rowCount; m++) {
			for (k = 0; k < keyCount; k++) {
				if ( json[m].hasOwnProperty(keys[k]) ) {
					csv += '"' + json[m][keys[k]] + '",';
				} else {
					csv += '"",';
				}
			}
			csv = csv.replace(/(,\s*$)/g, '') + '\n';
		}
		return csv;
	}

	function CSVToJSON(csv) {
		var csvRows = csv.split('\n');
		var csvKeys = csvRows[0].split(',');
		csvKeys = $.map(csvKeys, function(val, index) {
			return underscored( val.replace(/[\"\']/g, "") );
		});
		var keyCount = csvKeys.length;
		var rowCount = csvRows.length -1;
		var collection = [];

		for (var m = 1; m < rowCount; m++) {
			var obj = {};
			for (var n = 0; n < keyCount; n++) {
				var dataVal = csvRows[m].split(',')[n].replace(/[\"\']/g, "");
				if(!isNaN(dataVal)) { dataVal = +dataVal; }
				obj[csvKeys[n]] = dataVal;
			}
			collection.push(obj);
		}

		return { data: collection };
	}

	function CSVToTable() {

	}

	$.fn.tableToJSON = tableToJSON;
	$.fn.tableToCSV = tableToCSV;

	// utilities
	$.JSONToTable = JSONToTable;
	$.JSONToCSV = JSONToCSV;
	$.CSVToJSON = CSVToJSON;
	$.CSVToTable = CSVToTable;


})(jQuery, window, document);