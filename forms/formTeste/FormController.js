class FormController {
    constructor(activity, numProces, WKCardId, WKFormId, user, mobile, formMode) {
      this._atividade = activity;
      this._idProcesso = numProces;
      this._idCardForm = WKCardId;
      this._idForm = WKFormId;
      this._user = user;
      this._isMobile = mobile;
      this._formMode = formMode;
      this._fluigUtil = new Object({
        myComplete: new Object(),
        calendar: new Object()
      });
    
      this._FormView = new FormView();
      this._loadForm();
    }

    _loadForm()
    {
        this._setarMascaras();
        this._validarCnpj();
        Util.consultaCep();
        window["beforeSendValidate"] = () => this._validarCamposVazios();
        

    }

    _setarMascaras() {
        var behavior = function (val) {
          return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
          options = {
            onKeyPress: function (val, e, field, options) {
              field.mask(behavior.apply({}, arguments), options);
            }
          };
    
        $('.phone').mask(behavior, options);
    
        $('.data').mask('99/99/9999');
    
        $('.mascaraFinanceira').mask("#.##0,00", { reverse: true });
    
        $('.cnpj').mask('00.000.000/0000-00', { reverse: true });
    
        $('.cpf').mask('000.000.000-00', { reverse: true });

        $(".cep").mask("00000-000", {reverse: true});
    
      }

      /**
       * verifica se o cnpj é válido
       * @param {string} cnpj
       * @returns {boolean}
       */

    _verificarCnpj(cnpj)
    {
        var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
        var c = String(cnpj).replace(/[^\d]/g, '')
        
        if(c.length !== 14)
            return false

        if(/0{14}/.test(c))
            return false

        for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false

        for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
        if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false

        return true
        
    }

    _validarCnpj()
    {
        let vCnpj = this._verificarCnpj;
        $("#cnpj").on("blur", function(){
            let cnpj = $("#cnpj").val();
            if(cnpj.length == 18 && !vCnpj(cnpj))
            {
                FLUIGC.toast({
                    title: "",
                    message: "CNPJ inválido!",
                    type: "info"
                });
                $("#cnpj").val("");
            }
            });
        
    }

    anexarListaArquivos(elementoDOM, categoria, idListaHtml) {
      Fluig.anexarArquivo(elementoDOM, categoria, (elementoDOM) => {
        const botaoDOM = $(elementoDOM).parent().find('.btn');
        $(botaoDOM).removeClass('btn-danger');
        $(botaoDOM).addClass('btn-info');
        this.atualizarListaCategoria(idListaHtml, categoria);
      });
    }
    

    atualizarListaCategoria(idListaHtml, categoria) {
      let jsonPastas = JSON.parse($('#jsonPastas').val());
      if (jsonPastas.pastaRaiz != 'undefined' && jsonPastas.pastaRaiz != undefined) {
        if (!Util.estaVazio(jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria])) {
          let arquivosCotacoesAtivos = jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria].arquivos
            .filter(arquivo => arquivo.ativo != 2);
          $(`#${idListaHtml}`).html('');
          arquivosCotacoesAtivos.map((arquivo, index) => {
            $(`#${idListaHtml}`).append(this.getItemLista(arquivo.id, arquivo.nome, idListaHtml, categoria));
          });
        }
      }
    }

    getItemLista(idArquivo, nomeArquivo, idListaHtml, categoria) {
      return Mustache.render($('#templateItemLista').html(), {
        nomeArquivo: nomeArquivo,
        idArquivo: idArquivo,
        idListaHtml: idListaHtml,
        categoria: categoria
      });
    }

    visualizarArquivoLista(idArquivo) {
      const url = Fluig.obterUrlArquivo(idArquivo);
      window.open(url, '_blank');
    }

    removerArquivoLista(idArquivoRemovido, idListaHtml, categoria) {
      let jsonPastas = JSON.parse($('#jsonPastas').val());
      let indexArquivoRemovido = jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria].arquivos
        .findIndex(arquivo => arquivo.id == idArquivoRemovido);
      if (jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria].arquivos[indexArquivoRemovido].ativo == 1) {
        this.desativarArquivoCategoria(jsonPastas, indexArquivoRemovido, categoria);
      } else {
        this.deletarArquivoCategoria(jsonPastas, indexArquivoRemovido, idArquivoRemovido, categoria);
      }
      this.atualizarListaCategoria(idListaHtml, categoria);
  
      Fluig.verificarExclusaoPastasEmCadeia(jsonPastas, categoria);
    }

    desativarArquivoCategoria(jsonPastas, indexArquivoRemovido, categoria) {
      jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria].arquivos[indexArquivoRemovido].ativo = 2;
      $('#jsonPastas').val(JSON.stringify(jsonPastas));
      Util.exibirToast('OK!', 'Arquivo excluído com sucesso.', 'success');
    }
  
    deletarArquivoCategoria(jsonPastas, indexArquivoRemovido, idArquivo, categoria) {
      let resultadoRequisicao = Fluig.excluirArquivoPasta(idArquivo);
      if (resultadoRequisicao) {
        jsonPastas.pastaRaiz.filhos.pastaSolicitacao.filhos[categoria].arquivos.splice(indexArquivoRemovido, 1);
        $('#jsonPastas').val(JSON.stringify(jsonPastas));
      } else {
        Util.exibirToast(`Erro ao remover o documento.`, '', 'danger');
      }
    }

    _validarCamposVazios()
    {
        const temErro = false;
        var mensagem="";
        var camposNecessarios = $("form").find(":required");
        for (var i = 0; i < camposNecessarios.length; i++) {
            var field = camposNecessarios[i];
            console.log(`campo ${field.name} = ${field.value}`)
            if(field.value == "")
            {
              let nomeCampoTratado = $(field).parent().find("label").text().replace(":*", "")
              mensagem = mensagem+ "O campo "+ nomeCampoTratado + " é obrigatório!\n";
            }
          }
        if ($("#listaSolicitacao").children().length == 0) {mensagem = mensagem+ "É necessário anexar um arquivo!\n";}
        if(mensagem != "")
        {
          throw mensagem;
        }
    }
}