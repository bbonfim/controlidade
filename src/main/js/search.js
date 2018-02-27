'use strict';

const React = require('react');
const ReactDOM = require('react-dom')
const when = require('when');
const client = require('./client');
const follow = require('./follow');

const root = '/api';

//holds the first query string parameter, usually coming from the create product page
var queryStringFirstParam = window.location.search.substring(1);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {products: [], attributes: [], page: 1, pageSize: 10, links: {}};
    this.onDelete = this.onDelete.bind(this);
    if(queryStringFirstParam.includes("code")){
      this.fromCreatePage = true;
      this.productCode = decodeURIComponent(queryStringFirstParam.split("=")[1]);
    }

  }

  loadFromServer(pageSize) {
    var params = {size: pageSize};

    if(this.fromCreatePage){
      var params = {size: pageSize, code: this.productCode};
    }

    follow(client, root, [
      {rel: 'products', params: params}]
    ).then(productCollection => {
      return client({
        method: 'GET',
        path: productCollection.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
      }).then(schema => {
        // tag::json-schema-filter[]
        /**
         * Filter unneeded JSON Schema properties, like uri references and
         * subtypes ($ref).
         */
        Object.keys(schema.entity.properties).forEach(function (property) {
          if (schema.entity.properties[property].hasOwnProperty('format') &&
              schema.entity.properties[property].format === 'uri') {
            delete schema.entity.properties[property];
          }
          else if (schema.entity.properties[property].hasOwnProperty('$ref')) {
            delete schema.entity.properties[property];
          }
        });

        this.schema = schema.entity;
        this.links = productCollection.entity._links;
        return productCollection;
        // end::json-schema-filter[]
      });
    }).then(productCollection => {
      this.page = productCollection.entity.page;
      return productCollection.entity._embedded.products.map(product =>
          client({
            method: 'GET',
            path: product._links.self.href
          })
      );
    }).then(productPromises => {
      return when.all(productPromises);
    }).done(products => {
      this.setState({
        page: this.page,
        products: products,
        attributes: Object.keys(this.schema.properties),
        pageSize: pageSize,
        links: this.links
      });
    });
  }

  // tag::on-delete[]
  onDelete(product) {
    client({method: 'DELETE', path: product.entity._links.self.href}
    ).done(response => {/* let the websocket handle updating the UI */
        },
        response => {
          if (response.status.code === 403) {
            alert('ACCESS DENIED: You are not authorized to delete ' +
                product.entity._links.self.href);
          }
        });
  }

  // end::on-delete[]

  // tag::register-handlers[]
  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
  }

  render() {
    var extraInfoFromCreation;
    if(this.fromCreatePage){
      extraInfoFromCreation = (
          <div className="alert alert-success">
            <ul className="fa-ul">
              <li>
                <i className="fa fa-info-circle fa-lg fa-li"></i>Produto de codigo <code>{this.productCode}</code> criado com sucesso.
              </li>
            </ul>
          </div>
      )
    }
    return (
        <div>
          <ResultsTable products={this.state.products} onDelete={this.onDelete}/>
          {extraInfoFromCreation}
        </div>
    )
  }
}

class ResultsTable extends React.Component {
  render() {

    var products = this.props.products.map(product =>
        <Product key={product.entity.id} data={product.entity} length={this.props.products.length}/>
    );
    return (
        <div>
          <table id="datatable-fixed-header" className="table table-striped table-bordered">
            <thead>
            <tr>
              <th>Nome</th>
              <th>Codigo</th>
              <th>Categoria</th>
              <th>Data de Fabricacao</th>
              <th>Data de Vencimento</th>
              <th>Distribuidor</th>
            </tr>
            </thead>
            <tbody>
            {products}
            </tbody>
          </table>
        </div>
    )
  }
}

var rowCount = 0;
class Product extends React.Component {
  componentDidMount() {
    rowCount++;
    if (rowCount == this.props.length) {
      init_DataTables();
    }
  }

  render() {
    return (
        <tr>
          <td>{this.props.data.name}</td>
          <td>{this.props.data.code}</td>
          <td>{this.props.data.category}</td>
          <td>{this.props.data.manufactureDate}</td>
          <td>{this.props.data.expirationDate}</td>
          <td>{this.props.data.distributor}</td>
        </tr>
    )
  }
}


ReactDOM.render(
    <App />,
    document.getElementById('searchProduct')
)


