'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

var processId = window.location.pathname.split("/")[2];

var Loading = React.createClass({
  componentDidMount: function () {
    $.ajax({
      type: "POST",
      url: "/finish/" + processId,
      dataType: 'json',
      success: function(data){
        renderTable(data)
      }.bind(this),
      error: function(xhr, status, err){
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
        <div>
          Processando resultados. Aguarde alguns instantes... <img src="../images/box.gif"/>
        </div>
    )
  }
});
var DownloadButton = React.createClass({
  render: function () {
    return (
    <div>
      <form method="POST" action={"/download/"+ processId}>
        <input type="submit" value="Finalizar processo e Exportar para Excel"  className="btn btn-success btn-lg"/>
      </form>
    </div>
    )
  }
});

function renderTable(data) {
  ReactDOM.render(
      <ResultsTable nfes={data}/>,
      document.getElementById("result_table")
  );
}

var ResultsTable = React.createClass({
  componentDidMount: function () {
    ReactDOM.render(
        <DownloadButton />,
        document.getElementById("download_button")
    );
  },
  render: function () {

    var nfes = this.props.nfes.map(nfe =>
        <Nfe key={nfe.nfe.infNFe.id} data={nfe}/>
    );
    return (
        <div>
          <p className="text-muted font-13 m-b-30">
            A tabela abaixo mostra uma previa do arquivo Excel que sera gerado. Caso as informacoes estejam corretas, vc podera baixar o arquivo Excel clicando em "Fazer Download do Resultado".
          </p>
          <table id="datatable-fixed-header" className="table table-striped table-bordered">
            <thead>
            <tr>
              <th>CNPJ</th>
              <th>Razao Social</th>
              <th>Estado</th>
              <th>Logradouro</th>
              <th>Valor Unitario</th>
              <th>Versao</th>
            </tr>
            </thead>
            <tbody>
            {nfes}
            </tbody>
          </table>
        </div>
    )
  }
});

class Nfe extends React.Component {
  render() {
    return (
        <tr>
          <td>{this.props.data.nfe.infNFe.emit.cnpj}</td>
          <td>{this.props.data.nfe.infNFe.dest.xnome}</td>
          <td>{this.props.data.nfe.infNFe.ide.cuf}</td>
          <td>{this.props.data.nfe.infNFe.dest.enderDest.xlgr}</td>
          <td>{this.props.data.nfe.infNFe.det[0].prod.vunTrib}</td>
          <td>{this.props.data.versao}</td>
        </tr>
    )
  }
}

ReactDOM.render(
    <Loading />,
    document.getElementById("result_table")
);
