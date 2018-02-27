'use strict';

const React = require('react');
const ReactDOM = require('react-dom')
const when = require('when');
const client = require('./client');
const follow = require('./follow');

const root = '/api';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {products: [], attributes: [], page: 1, pageSize: 2, links: {}};
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, root, [
      {rel: 'products', params: {size: pageSize}}]
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
          if (property === 'id' || (schema.entity.properties[property].hasOwnProperty('format') &&
              schema.entity.properties[property].format === 'uri')) {
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
      return productCollection.entity._embedded.products.map(employee =>
          client({
            method: 'GET',
            path: employee._links.self.href
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

  // tag::on-create[]
  onCreate(newProduct) {
    follow(client, root, ['products']).done(response => {
      client({
        method: 'POST',
        path: response.entity._links.self.href,
        entity: newProduct,
        headers: {'Content-Type': 'application/json'}
      }).done(response => {
        window.location = "search?code=" + newProduct.code;
        });
    });
  }

  // end::on-create[]


  // tag::on-update[]
  onUpdate(product, updatedProduct) {
    client({
      method: 'PUT',
      path: product.entity._links.self.href,
      entity: updatedProduct,
      headers: {
        'Content-Type': 'application/json',
        'If-Match': product.headers.Etag
      }
    }).done(response => {
      /* Let the websocket handler update the state */
    }, response => {
      if (response.status.code === 403) {
        alert('ACCESS DENIED: You are not authorized to update ' +
            product.entity._links.self.href);
      }
      if (response.status.code === 412) {
        alert('DENIED: Unable to update ' + product.entity._links.self.href +
            '. Your copy is stale.');
      }
    });
  }

  // end::on-update[]

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
    return (
        <div>
          <CreateProductForm attributes={this.state.attributes} onCreate={this.onCreate}/>
        </div>
    )
  }
}


class CreateProductForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var newProduct = {};
    this.props.attributes.forEach(attribute => {
      newProduct[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newProduct);
  }

  render() {
    return (
        <div>
          <form id="demo-form2" data-parsley-validate="" className="form-horizontal form-label-left" noValidate="" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="name">Nome do Produto <span className="required">*</span>
              </label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input type="text" id="name" required="required" className="form-control col-md-7 col-xs-12" ref="name"/>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="category">Categoria <span className="required">*</span>
              </label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input type="text" id="category" name="category" required="required" ref="category" className="form-control col-md-7 col-xs-12"/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="code" className="control-label col-md-3 col-sm-3 col-xs-12">Codigo do Produto</label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input id="code" className="form-control col-md-7 col-xs-12" type="text" name="code" ref="code"/>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="single_cal3" className="control-label col-md-3 col-sm-3 col-xs-12">Data de Fabricacao</label>
              <div className="col-md-6 col-sm-6 col-xs-12 xdisplay_inputx form-group has-feedback">
                <div className="control-group">
                  <div className="controls">
                    <div>
                      <input type="text" ref="manufactureDate" className="form-control has-feedback-left col-md-7 col-xs-12" id="single_cal3" name="manufactureDate" placeholder="Data de Fabricacao"
                             aria-describedby="inputSuccess2Status3"/>
                      <span className="fa fa-calendar-o form-control-feedback left" aria-hidden="true"></span>
                      <span id="inputSuccess2Status3" className="sr-only">(success)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="single_cal4" className="control-label col-md-3 col-sm-3 col-xs-12">Data de Vencimento</label>
              <div className="col-md-6 col-sm-6 col-xs-12 xdisplay_inputx form-group has-feedback">
                <div className="control-group">
                  <div className="controls">
                    <div>
                      <input type="text" ref="expirationDate" className="form-control has-feedback-left col-md-7 col-xs-12" id="single_cal4" name="expirationDate" placeholder="Data de Vencimento"
                             aria-describedby="inputSuccess2Status4"/>
                      <span className="fa fa-calendar-o form-control-feedback left" aria-hidden="true"></span>
                      <span id="inputSuccess2Status4" className="sr-only">(success)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="distributor" className="control-label col-md-3 col-sm-3 col-xs-12">Distribuidor</label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input id="distributor" ref="distributor" className="form-control col-md-7 col-xs-12" type="text" name="distributor"/>
              </div>
            </div>
            <div className="ln_solid"></div>
            <div className="form-group">
              <div className="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                <button className="btn btn-primary" type="reset">Limpar</button>
                <button type="submit" className="btn btn-success">Salvar Produto</button>
              </div>
            </div>
          </form>
        </div>
    )
  }

}

ReactDOM.render(
    <App />,
    document.getElementById('createProduct')
)


