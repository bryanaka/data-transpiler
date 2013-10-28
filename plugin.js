(function($, window, document, undefined) {

	var defaults = {
		ignore: []
	};

	function getKeys($el) {
		var keys = $el.find('th').map(function(index, val) {
			return val.innerText;
		});
		return $.makeArray(keys);
	}

	function getUnderscoredKeys($el) {
		var keys = $el.find('th').map(function(index, val) {
			return val.innerText.replace(/\s/gi, "_");
		});
		return $.makeArray(keys);
	}

	function getData($el) {
		return $el.find('td').map(function(index, val) {
			return val.innerText;
		});
	}

	function tableToJSON() {
		var keys      = getUnderscoredKeys(this),
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

		csv = csv + '"'+keys.join('\",\"') + '"\n';
		while(i < dataCount) {
			for(var n = 0; n < keyCount; n++) {
				csv = csv + '"'+data[i]+'",';
				i++;
			}
			csv = csv.replace(/(,\s*$)/g, '') + '\n';
		}
		return csv;
	}

	function JSONToTable(json) {
		var keys = [],
			key,
			keyCount,
			headers,
			data,
			rowCount = 1,
			table,
			i, n, m, k;

		// cycle through array of objects and get all possible keys
		if( $.isArray(json) ) {
			rowCount = json.length;

			for (n = 0; n < rowCount; n++) {
				for (key in json[n]) {
					if( !$.inArray(key) || n === 0 ) {
						keys.push(key);
					}
				}
			}
		}
		keyCount = keys.length;
		table = '<table>';

		// headers
		headers = '<thead><tr>';
		for (i = 0; i < keyCount; i++) {
			headers += '<th>' + keys[i] + '</th>';
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

	function JSONToCSV() {}

	function CSVToTable() {}
	function CSVToJSON() {}

	$.fn.tableToJSON = tableToJSON;
	$.fn.tableToCSV = tableToCSV;
	$.JSONToTable = JSONToTable;


})(jQuery, window, document);