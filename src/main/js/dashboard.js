'use strict';

const React = require('react');
const ReactDOM = require('react-dom')
const when = require('when');
const client = require('./client');
const follow = require('./follow');

const root = '/api';

class CategoryBox extends React.Component {
  render() {
    return (
        <div className="animated flipInY col-lg-3 col-md-3 col-sm-6 col-xs-12">
          <div className="tile-stats">
            <div className="count">{this.props.count}</div>
            <h3>{this.props.name}</h3>
          </div>
        </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {categories: [], from: moment(), to: moment()};
  }

  loadFromServer(from, to, label) {
    $.ajax({
      type: "get",
      url: "/categories?from=" + from + "&to=" + to,
      dataType: 'json',
      success: function (data) {
        this.setState({
          categories: data,
          from: from,
          to: to
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error("/categories", status, err.toString());
      }.bind(this)
    });
  }

  initDateRangePicker() {
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
      console.log(start, end, label);
      this.loadFromServer(start.valueOf(), end.valueOf());
      $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }.bind(this);

    var optionSet1 = {
      startDate: moment().add(29, 'days'),
      endDate: moment(),
      minDate: '01/01/2014',
      maxDate: '31/12/2020',
      dateLimit: {
        days: 1000000000000
      },
      showDropdowns: true,
      showWeekNumbers: true,
      timePicker: false,
      timePickerIncrement: 1,
      timePicker12Hour: true,
      ranges: {
        'Today': [moment(), moment()],
        'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
        'Next 7 Days': [moment().add(6, 'days'), moment()],
        'Next 30 Days': [moment().add(29, 'days'), moment()],
        'This Month': [moment().add('month'), moment().endOf('month')],
        'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
      },
      opens: 'left',
      buttonClasses: ['btn btn-default'],
      applyClass: 'btn-small btn-primary',
      cancelClass: 'btn-small',
      format: 'DD/MM/YYYY',
      separator: ' to ',
      locale: {
        applyLabel: 'Submit',
        cancelLabel: 'Clear',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
      }
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('show.daterangepicker', function() {
      // console.log("show event fired");
    });
    $('#reportrange').on('hide.daterangepicker', function() {
      // console.log("hide event fired");
    });
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      // console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
      // console.log("cancel event fired");
    });
    $('#options1').click(function() {
      $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function() {
      $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function() {
      $('#reportrange').data('daterangepicker').remove();
    });
  }

  componentDidMount() {
    this.initDateRangePicker();
    this.loadFromServer(moment(), moment().add(1, 'days').valueOf());
  }

  render() {
    var categoriesBoxes = this.state.categories.map(categorie =>
        <CategoryBox key={categorie.id} count={categorie.count} name={categorie.name}/>
    );

    const rangeStyle = {
      background: '#fff',
      cursor: 'pointer',
      padding: '5px 10px',
      border: '1px solid #ccc'
    };

    const chartStyle = {
      width: '100%',
      height: '300px'
    };
    return (
        <div className="">
          <div className="page-title">
            <div className="title_left">
              <h3>Dashboard</h3>
            </div>
            <div className="title_right">
              <div className="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                <div className="input-group">
                  <div id="reportrange" className="pull-right" style={rangeStyle}>
                    <i className="glyphicon glyphicon-calendar fa fa-calendar"></i>
                    <span>December 30, 2014 - January 28, 2015</span> <b className="caret"></b>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>

          {categoriesBoxes}
        </div>
    )
  }
}


ReactDOM.render(
    <App />,
    document.getElementById('dashboard')
)


