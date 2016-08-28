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

$('#categoryChooser input[type=checkbox]').click(function(event) {
	var categories = $('#categoryChooser input[type=checkbox]');
	var category_ids = [];

	for (var i = 0; i < categories.length; i++) {
		if (categories[i].checked) {
			category_ids.push(categories[i].getAttribute('data-id'));
		}
	}

	$('input[name="category_ids"]').val(category_ids.join(','));
});

$('#createCategoryModal').on('shown.bs.modal', function() {
	$('#createCategoryForm input[name=label]').focus();
});

$('#createCategoryForm input[name=label]').keyup(function(event) {
	 var status = $('#createCategoryForm input[name=label]').val() == '' ? true : false;
	 $('#actionCreateCategory').attr('disabled', status);
});

$('#actionCreateCategory').click(function(event) {
	var magic_token = $('#objForm input[name=magic_token]').val();
	var blog_id = $('#objForm input[name=blog_id]').val();
	var label = $('#createCategoryForm input[name=label]').val();
	var url = $('#createCategoryForm').attr('action');

	$.ajax({
		data: {
			'__mode': 'js_add_category',
			'magic_token': magic_token,
			'blog_id': blog_id,
			'parent': '0',
			'_type': 'category',
			'label': label
		},
		method: 'POST',
		url: url
	}).done(function(msg) {
		$('#categoryChooser').prepend(
			'<div class="checkbox"><label><input type="checkbox" name="add_category_id_' +
			msg.result.id + '" data-id="' + msg.result.id + '" checked>' + label + '</label></div>'
		);
		$('#createCategoryModal').modal('hide');
		$('#createCategoryForm input[name=label]').val('');
	});
});

$('#actionInsertYouTube').click(function(event) {
    event.preventDefault();

    var txt = '<p><iframe width="620" height="349" src="http://www.youtube.com/embed/XXXXXXXXXXX?rel=0" frameborder="0" allowfullscreen></iframe></p>';
    var box = $('textarea[name="text"]');

    box.val(box.val() + '\n\n' + txt);
});

$('#actionInsertVia').click(function(event) {
    event.preventDefault();

    var txt = '<small>via [XXXX](XXXX)</small>';
    var box = $('textarea[name="text"]');

    box.val(box.val() + '\n\n' + txt);
});

});
