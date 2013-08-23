google.load('visualization', '1', {packages:['corechart']});

$(document).ready(function() {

var graph = new StatGraph();

function StatGraph() {
	var _this       = this,
	    source      = $('#mtlStatSource'),
	    destination = $('#mtlStatGraph');

	if(!source.length || !destination.length) {
		return false;
	}

	this.source_url  = source.attr('href');
	this.data_table  = new google.visualization.DataTable();
	this.chart       = new google.visualization.AreaChart(destination.get(0));
	this.description = $('#mtlStatNote');

	this.buildGraph = function() {
		$.get(_this.source_url, function(data) {
			var $xml = $(data),
			    graph_data = [],
			    total = 0,
			    msg;

			$xml.find('count[date]').each(function(index) {
				var date  = new Date(parseInt($(this).attr('date').slice(0, 4)), parseInt($(this).attr('date').slice(4, 6)) - 1, parseInt($(this).attr('date').slice(6, 8))),
				    count = parseInt($(this).text()),
				    fake_count = Math.floor(Math.random() * 50) + 1;
				graph_data.push([date, count]);
				total = total + count;
			});

			_this.data_table.addColumn('date', 'Date');
			_this.data_table.addColumn('number', 'Posts');
			_this.data_table.addRows(graph_data);

			_this.drawChart();

			msg = _this.description.text();
			msg = msg.replace('$1', total);
			msg = msg.replace('$2', graph_data.length);
			_this.description.text(msg);
			_this.description.parent().toggle();
		});
	};

	this.drawChart = function() {
		this.chart.draw(this.data_table, {
			backgroundColor: {
				strokeWidth: 1
			},
			hAxis: {
				baselineColor: '#ccc'
			},
			legend: {
				position: 'none'
			},
			theme: 'maximized',
			vAxis: {
				baselineColor: '#ccc'
			}
		});
	};

	this.buildGraph();

	$(window).resize(function() {
		_this.drawChart();
	});
}

$('.disabled').click(function(event) {
    event.preventDefault();
});

$('#actionDeleteObj').click(function(event) {
    var type = $('input[name="_type"]').val();
    var blog_id = $('input[name="blog_id"]').val();

    $('input[name="return_args"]').val('__mode=list_' + type + '&blog_id=' + blog_id);
    $('input[name="__mode"]').val('delete');
    $('#objForm').submit();
});

});
