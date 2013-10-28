describe('converting data', function() {
	var tableData = '<table>'+
		'<thead>' +
			'<tr>' +
				'<th>first name</th>' +
				'<th>last name</th>' +
				'<th>age</th>' +
				'<th>favorite food</th>' +
			'</tr>' +
		'</thead>' +
		'<tbody>' +
			'<tr>' +
				'<td>bryan</td>' +
				'<td>robles</td>' +
				'<td>23</td>' +
				'<td>soft shell crab</td>' +
			'</tr>' +
			'<tr>' +
				'<td>kelly</td>' +
				'<td>montgomery</td>' +
				'<td>52</td>' +
				'<td>soup</td>' +
			'</tr>' +
			'<tr>' +
				'<td>jess</td>' +
				'<td>hogan</td>' +
				'<td>21</td>' +
				'<td>vegan pizza</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';

	var JSONData = {
	data:[{
			first_name: 'bryan',
			last_name: 'robles',
			age: 23,
			favorite_food: 'soft shell crab'
		},{
			first_name: 'kelly',
			last_name: 'montgomery',
			age: 52,
			favorite_food: 'soup'
		},{
			first_name: 'jess',
			last_name: 'hogan',
			age: 21,
			favorite_food: 'vegan pizza'
		}]
	};

	var JSONDataKeys = ['first_name', 'last_name', 'age', 'favorite_food'];
	var dataHeaders  = ['first name', 'last name', 'age', 'favorite food'];

	var CSVData = '"first name","last name","age","favorite food"\n' +
		'"bryan","robles","23","soft shell crab"\n'+
		'"kelly","montgomery","52","soup"\n'+
		'"jess","hogan","21","vegan pizza"\n';

	describe('tableToJSON', function() {
		var tableJSON = $(tableData).tableToJSON();
		var data = tableJSON.data;

		it('converts table data to an array of objects', function() {
			expect(typeof data[0]).toBe('object');
		});

		it('converts headers to the keys of an object', function() {
			var headers = ['first_name', 'last_name', 'age', 'favorite_food'];
			headers.forEach(function(val, index) {
				expect(data[0].hasOwnProperty(val)).toBeTruthy();
			});
		});

		it('correctly puts each row into an object', function() {
			expect(JSON.stringify(tableJSON)).toEqual(JSON.stringify(JSONData));
		});

	});

	describe('tableToCSV', function() {
		var tableCSV = $(tableData).tableToCSV();

		it('converts headers to the first line of data in CSV', function() {
			var headers = tableCSV.split('\n')[0];
			expect(headers).toEqual( CSVData.split('\n')[0] );
		});

		it('converts each row into a row of CSV data', function() {
			expect(tableCSV).toEqual(CSVData);
		});
	});

	describe('JSONToTable', function() {
		var tableFromJSON = $.JSONToTable(JSONData.data);

		it('converts JSON keys to the table headers', function() {
			var headers = $(tableFromJSON).find('th');
			headers.each( function(index, val) {
				var testKey = val.innerText.replace(/\s/gi, "_");
				expect( JSONData.data[0].hasOwnProperty(testKey) ).toBeTruthy();
			});
		});

		it('converts JSON object values to the data cells', function() {
			expect(tableFromJSON).toEqual(tableData);
		});

	});

	describe('JSONToCSV', function() {
		var CSVFromJSON = $.JSONToCSV(JSONData.data);

		it('converts the JSON keys to the first row of the CSV', function() {
			var headers = CSVFromJSON.split('\n')[0];
			expect(headers).toEqual( CSVData.split('\n')[0] );
		});

		it('converts the Object values to CSV rows.', function() {
			expect(CSVFromJSON).toEqual(CSVData);
		});
	});

	describe('CSVToJSON', function() {
		var JSONFromCSV = $.CSVToJSON(CSVData);

		it('converts the first row of CSV to JSON Keys', function() {
			JSONDataKeys.forEach(function(val, index) {
				expect(JSONFromCSV.data[0].hasOwnProperty(val)).toBeTruthy();
			});
		});

		it('converts each row of the CSV to an object inside an array', function() {
			expect( JSON.stringify(JSONFromCSV) ).toEqual( JSON.stringify(JSONData) );
		});
	});

	describe('CSVToTable', function() {
		var tableFromCSV = $.CSVToTable(CSVData);

		it('converts the first row of CSV to Table Headers', function() {
			var headers = $(tableFromCSV).find('th');
			headers.each( function(index, val) {
				var testHeader = val.innerText;
				expect(testHeader).toEqual(dataHeaders[index]);
			});
		});

		it('converts each row of the CSV to a row inside a table', function() {
			expect(tableFromCSV).toEqual(tableData);
		});
	});


});