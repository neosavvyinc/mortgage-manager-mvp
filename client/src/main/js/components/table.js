'use strict';

var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var _ = require('lodash');

var Table = React.createClass({
	mixins: [
		Router.State,
		Router.Navigation
	],

	render: function() {
		var table = [];

		_.forEach(this.props.table, function(value, key) {

			table.push((
				<tr>
					<td className={this.props.textPosition ? "text-center" : ""}>{key}</td>
					{value.map(function(val) {
						return ((<td className={this.props.textPosition ? "text-center" : ""}>{val}</td>));
					}.bind(this))}
				</tr>
			));
		}.bind(this));

		return (
            <div className="table-responsive">
                <table className="table table-striped">
                    {this.props.colSpacing.map(function(col) {
						return (col);
					})}
					{this.props.header}
					<tbody>
                        {table.map(function(row) {
                            return (row);
                        })}
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = Table;