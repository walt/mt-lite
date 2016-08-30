$(function() {

$.get($('#mtlStatSource').attr('href'), function(data) {
	var calendar_heatmap_data = {
		'dates': [],
		'total': 0,
		'max': 0
	};

	$(data).find('count[date]').each(function() {
		var count = parseInt($(this).text());

		calendar_heatmap_data.dates.push({
			'date': new Date(
				parseInt($(this).attr('date').slice(0, 4)),
				parseInt($(this).attr('date').slice(4, 6)) - 1,
				parseInt($(this).attr('date').slice(6, 8))
			),
			'count': count
		});

		calendar_heatmap_data.total = calendar_heatmap_data.total + count;

		calendar_heatmap_data.max =
			count > calendar_heatmap_data.max ?
			count : calendar_heatmap_data.max;
	});

	var square_size = 10,
		square_margin = 2,
		x_multiplier = 0,
		y_multiplier = calendar_heatmap_data.dates[0].date.getDay();

	var svg_width = square_size + square_margin;
		svg_width = svg_width * Math.ceil(calendar_heatmap_data.dates.length / 7);
		svg_width = svg_width - square_margin;
	if (y_multiplier == 6) {
		svg_width = svg_width + (square_size + square_margin);
	}

	var svg_height = ((square_size + square_margin) * 7) - square_margin;

	var svg = d3.select('#mtlStatGraph')
		.append('svg')
		.attr('viewBox', '0 0 ' + svg_width + ' ' + svg_height)
		.attr('preserveAspectRatio', 'xMinYMin meet')
		.style('max-width', svg_width * 2 + 'px');

	var color = d3.scaleLinear()
		.range(['#f2f2f2', '#337ab7'])
		.domain([0, calendar_heatmap_data.max]);

	for (var i = 0; i < calendar_heatmap_data.dates.length; i++) {
		svg.append('rect')
			.attr('x', (square_size + square_margin) * x_multiplier)
			.attr('y', (square_size + square_margin) * y_multiplier)
			.attr('width', square_size)
			.attr('height', square_size)
			.style('fill', color(calendar_heatmap_data.dates[i].count));

		if (y_multiplier < 6) {
			y_multiplier = y_multiplier + 1;
		} else  {
			x_multiplier = x_multiplier + 1;
			y_multiplier = 0;
		}
	}

	var note = $('#mtlStatNote');
	var msg = note.text();

	msg = msg.replace('$1', calendar_heatmap_data.total);
	msg = msg.replace('$2', calendar_heatmap_data.dates.length);

	note.text(msg);
	note.parent().toggle();
});

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

});
