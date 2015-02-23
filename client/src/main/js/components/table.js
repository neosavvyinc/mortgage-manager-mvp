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
					<td className="align-center">{key}</td>
					{value.map(function(val) {
						return ((<td className="align-center">{val}</td>));
					})}
				</tr>
			));
		});

		return (
			<div className="container gap-right">
				<table className="responsive">
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