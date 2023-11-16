class Util {
  constructor() { }

  static exibeImagem(imagemHex, campoImagem) {
    document.getElementById(campoImagem).src = "data:image/jpeg;base64," + imagemHex;
  }

  static estaVazio(elemento) {
    if (elemento == "" || elemento == null || elemento == undefined || elemento == '{}')
      return true;
    return false;
  }

  /**
   * Método para exibir loading.
   *
   * @param {function} fn Função que será realizada após a abertura do loading
   */
  static carregamento(fn, msg = 'Carregando, por favor aguarde...') {
    const carregamento = FLUIGC.loading(window, {
      textMessage: msg
    });
    carregamento.show();
    setTimeout(function () {
      fn();
      carregamento.hide();
    }, 300);
  }

  /**
   * @function mostraLoading Show loading and execute any function with previous context.
   * @param {Object} loading loading variable reference.
   * @param {Function} anyFunction function to execute while loading shows.
   * @param {Array<Object>} anyParam Array of any param to repass to function in the same order.
   * @param {This} context This context of function.
   */
  static mostraLoadingComFuncao({ loading, anyFunction, anyParam, context }) {
    Util.estaVazio(loading) ? loading = FLUIGC.loading(window) : null;
    loading.show();
    setTimeout(function () {
      let contextedFunction;
      if (Util.estaVazio(context)) {
        contextedFunction = anyFunction;
      } else {
        contextedFunction = anyFunction.bind(context);
      }
      contextedFunction.apply(this, anyParam);
      loading.hide();
    }, 300);
  }

  /**
   * Método para exibir um toast do fluig.
   *
   * @param {String} title Título do toast.
   * @param {String} message Mensagem do toast.
   * @param {String} type Tipo do toast, podendo ser: 'success', 'warning', 'danger' ou 'info'.
   * @param {String || number} timeout Tempo de duração do timeout. (Default: 4000)
   */
  static exibirToast(title, message, type, timeout = 4000) {
    FLUIGC.toast({
      title,
      message,
      type,
      timeout
    });
  }

  /**
 * Método para habilitar ou desabilitar campos do formulário.
 *
 * @param {Array} seletor Array de classes, ids ou names onde os campos devem ser habilitados/desabilitados.
 * @param {Boolean} desabilitar True se os campos devem ser desabilitados, false se os campos devem ser habilitados. (Default: true)
 */
  static desabilitarCampos([...seletor], desabilitar = true, naoSelecionar = '') {
    seletor.forEach(idNameCampo => {
      let campo = null;

      if ((idNameCampo.indexOf('#') != -1 && idNameCampo.indexOf('#div') == -1) || idNameCampo.indexOf('[name') != -1) {
        campo = $(idNameCampo);
      } else {
        campo = $(idNameCampo).find('input, select, button, textarea, span').not(naoSelecionar);
      }

      campo.each(function () {
        const id = this.id;
        const tag = this.tagName.toLowerCase();
        const type = this.type;

        if (tag == 'select') {
          if (type == 'select-multiple') {
            window[id].disable(desabilitar);
          } else {
            this.readOnly = desabilitar;
            this.style.pointerEvents = desabilitar ? 'none' : '';
            this.style.touchAction = desabilitar ? 'none' : '';
            this.style.backgroundColor = desabilitar ? '#eee' : '#fff';
          }
        } else {
          if (tag == 'span') {
            desabilitar ? this.classList.add('disabled') : this.classList.remove('disabled');
            desabilitar ? $(this.classList).css('cursor', 'not-allowed') : $(this.classList).css('cursor', 'pointer');
          } else if (tag == 'button' || type == 'file' || (type == 'radio' && !this.checked)) {
            this.disabled = desabilitar;
          } else if (type == 'checkbox') {
            $(this).parent().css('pointer-events', 'none');
            $(this).parent().find('label').toggleClass('disabled');
          } else if (type == 'button') {
            desabilitar ? this.classList.add('disabled') : this.classList.remove('disabled');
          } else if (type == 'radio') {
            if (!$(`#${id}`).is(':checked')) {
              $(`#${id}`).attr('disabled', desabilitar);
            }
          } else if (type == 'file') {
            desabilitar ? this.classList.add('disabled') : this.classList.remove('disabled');
          } else {
            this.readOnly = desabilitar;
          }
        }
      });
    });
  }

  /**
   * Método para instanciar um novo calendário do fluig em um determinado elemento.
   *
   * @param {String} idElemento Id do elemento onde o calendário será instanciado.
   * @param {Boolean} selecionarData Determina se será possível selecionar data. (Default: true)
   * @param {Boolean} selecionarHora Determina se será possível selecionar hora. (Default: false)
   */
  static criarCalendario(idElemento, selecionarData = true, selecionarHora = false) {
    return FLUIGC.calendar(`#${idElemento}`, {
      pickDate: selecionarData,
      pickTime: selecionarHora
    });
  }

  static criarCalendarioHorario(idElemento, selecionarData = false, selecionarHora = true) {
    return FLUIGC.calendar(`#${idElemento}`, {
      pickDate: selecionarData,
      pickTime: selecionarHora
    });
  }

  static criarCalendarioMesAno(idElemento, selecionarData = true, selecionarHora = false) {
    return FLUIGC.calendar(`#${idElemento}`, {
      startView: "year",
      minViewMode: "months",
      pickTime: false,
      format: 'MM/YYYY',
      showMonthAfterYear: true,
      language: "pt_BR"
    });
  }



  static converterDataMMDDYYYYParaDDMMYYYY(dataString) {
    let partesData = dataString.split("/");
    let dateObject = new Date(+partesData[2], partesData[1] - 1, +partesData[0]);
    return dateObject.toString();
  }

  static clearTable(tablename) {
    if (!tablename || $("table[tablename=" + tablename + "]").length == 0) return;
    window.rowIndex[tablename] = 0;
    $('table[tablename=' + tablename + '] tbody tr').not(':first').remove();
  }

  static reloadIndex(tablename) {
    window.rowIndex[tablename] = $('table[tablename=' + tablename + '] tbody tr').not(':first').length;
  }

  static converterDataDDMMYYYYParaMMDDYYYY(dataString) {
    let initial = dataString.split(/\//);
    return ([initial[1], initial[0], initial[2]].join('/'));
  }

  static destacarAtividadeAtual(...referenciasPainelAtual) {
    referenciasPainelAtual.map((referencia) => {
      referencia = referencia.indexOf('#') != -1 ? referencia : `#${referencia}`;
      if ($(referencia).children(":first-child")[0].className.includes('panel-primary')) {
        setTimeout(() => {
          if (window && window.formController && window.formController._formMode != "VIEW") {
            $(document).scrollTop(0);
            $(referencia)[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1000);
      } else if ($(referencia)[0].className.includes('panel-primary')) {
        setTimeout(() => {
          if (window && window.formController && window.formController._formMode != "VIEW") {
            $('html, body').animate({
              scrollTop: $(referencia).offset().top
            }, 500);
          }
        }, 1000);
      }
      $(referencia)[0].className.includes('panel-primary') || $(referencia)[0].className.includes('panel-default')
        ? $(referencia)[0].className = 'panel panel-info'
        : $(referencia).children(":first-child")[0].className = 'panel panel-info'
    });
  }

  static destacarOpcaoAprovacao(...referenciasPainelAtual) {
    referenciasPainelAtual.map(referencia => {
      referencia = referencia.indexOf('#') != -1 ? referencia : `#${referencia}`;
      $(referencia)[0].className.includes('panel-primary') || $(referencia)[0].className.includes('panel-default')
        ? $(referencia)[0].className = 'panel panel-approval'
        : $(referencia).children(":first-child")[0].className = 'panel panel-approval'
    });
  }

  static contrairTodosCollapses() {
    $('.panel-primary,.panel-default').each((index, element) => {
      $(element).find('.panel-collapse').first().removeClass('in');
    });
  }

  static expandirCollapsesDestacados() {
    $('.panel-info, .panel-approval').each((index, element) => {
      $(element).find('.panel-collapse').first().addClass('in')
    })
  }

  static expandirCollapseAjusteSolicitado(...referenciaPainelCollapse) {
    referenciaPainelCollapse.map((referencia) => {
      referencia = referencia.indexOf('#') != -1 ? referencia : `#${referencia}`;
      $(referencia).find('.panel-collapse').first().addClass('in');
    });
  }

  static toDate(dateStr) {
    let parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  static ajustarTitulo(idTable) {
    $('table#' + idTable + ' tbody tr h4').not(':first').each(function (index, element) {
      element.textContent = 'Item ' + parseInt(index + 1);
    });
  }

  static buscarItemJaSelecionadoTabela(idTabela, idCampo, valorCampo) {
    let flagItemFound = 0;
    $(`table#${idTabela} tbody tr`).not(':first').each(function (index, element) {
      const valorZoomItem = $(element).find(`[id^="${idCampo}"]`).first().val();
      if (valorZoomItem && valorZoomItem.length > 0 && valorZoomItem[0] == valorCampo) {
        flagItemFound++;
      }
    });
    return flagItemFound > 1;
  }

  static getDataAtual() {
    Number.prototype.padLeft = function (base, chr) {
      var len = (String(base || 10).length - String(this).length) + 1;
      return len > 0 ? new Array(len).join(chr || '0') + this : this;
    }

    var d = new Date;
    var dformat = [d.getFullYear(),
    (d.getMonth() + 1).padLeft(),
    d.getDate().padLeft()].join('/') + ' ' +
      [d.getHours().padLeft(),
      d.getMinutes().padLeft(),
      d.getSeconds().padLeft()].join(':');
    return dformat;
  }

  static getDataAtualRM() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    const hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    const minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
    const currentHour = hour + ":" + minute + ":" + second;
    return year + '-' + month + '-' + day + 'T' + currentHour;
  }

  static converterReaisEmFloat(valorEmReais) {
    return parseFloat(valorEmReais.replaceAll('.', '').replace(',', '.'));
  }

  static converterFloatEmReais(valorEmFloat) {
    return valorEmFloat.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  static mesAnoValido(mesAno) {
    if (mesAno.includes('/')) {
      const partes = mesAno.split('/');
      const stringDate = partes[1] + '-' + partes[0] + '-' + '10';
      if (new Date(stringDate) == 'Invalid Date') {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  static hex2(hexx) {
    for (var hex = String(hexx), str = "", i = 0; i < hex.length && "00" !== hex.substr(i, 2); i += 2)str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  static a2hex(str) {
    str = String(str); for (var arr = [], i = 0, l = str.length; i < l; i++) { var hex = Number(str.charCodeAt(i)).toString(16); arr.push(hex) }
    return arr.join('');
  }

  /**
   * Mascara do campo - CPF/CNPJ, altera dinamicamente
   * @param campo     - Campos do FormulÃ¡rio
   * @param teclapres - Tecla pressionada
   * @returns {Boolean}
   */
  static mascaraCpfCnpj(campo, teclapres) {
    let tecla = teclapres.keyCode;
    if ((tecla < 48 || tecla > 57) && (tecla < 96 || tecla > 105) && tecla != 46 && tecla != 8 && tecla != 9) {
      return false;
    }
    let vr = campo.value;
    vr = vr.replace(/\//g, "");
    vr = vr.replace(/-/g, "");
    vr = vr.replace(/\./g, "");
    let tam = vr.length;
    if (tam <= 2) {
      campo.value = vr;
    }
    if ((tam > 2) && (tam <= 5)) {
      campo.value = vr.substr(0, tam - 2) + '-' + vr.substr(tam - 2, tam);
    }
    if ((tam >= 6) && (tam <= 8)) {
      campo.value = vr.substr(0, tam - 5) + '.' + vr.substr(tam - 5, 3) + '-' + vr.substr(tam - 2, tam);
    }
    if ((tam >= 9) && (tam <= 11)) {
      campo.value = vr.substr(0, tam - 8) + '.' + vr.substr(tam - 8, 3) + '.' + vr.substr(tam - 5, 3) + '-' + vr.substr(tam - 2, tam);
    }
    if ((tam == 12)) {
      campo.value = vr.substr(tam - 12, 3) + '.' + vr.substr(tam - 9, 3) + '/' + vr.substr(tam - 6, 4) + '-' + vr.substr(tam - 2, tam);
    }
    if ((tam > 12) && (tam <= 14)) {
      campo.value = vr.substr(0, tam - 12) + '.' + vr.substr(tam - 12, 3) + '.' + vr.substr(tam - 9, 3) + '/' + vr.substr(tam - 6, 4) + '-' + vr.substr(tam - 2, tam);
    }
    if (tam > 13) {
      if (tecla != 8) {
        return false
      }
    }
  }

  static criarAutocomplete(seletorElemento, tipo, param) {
    const filterConfig = {
      source: {
        url: '',
        contentType: 'application/json',
        root: 'content',
        minLength: 1,
        limit: 10,
        offset: 0,
        patternKey: 'searchValue',
        limitkey: ',',
        offsetKey: 'offset'
      },
      displayKey: '',
      multiSelect: false,
      highlight: true,
      tagClass: 'tag-gray',
      type: 'autocomplete',
      tagMaxWidth: '',
      maxTags: '',
      onMaxTags: ''
    }
    switch (tipo) {
      case 'signatario':
        filterConfig.source.url = '/api/public/ecm/dataset/search?datasetId=ds_vertsign_assinantes&searchField=nome&';
        filterConfig.displayKey = 'nome';
        filterConfig.tagMaxWidth = '800px';
        filterConfig.maxTags = 1;
        filterConfig.onMaxTags = (item, tag) => {
          FLUIGC.toast({
            message: 'Somente um Assinante pode ser selecionado.',
            type: 'danger'
          });
        };
        break;
      case 'signatarioAsjur':
        filterConfig.source.url = '/api/public/ecm/dataset/search?datasetId=ds_vertsign_assinantes&searchField=nome&';
        filterConfig.displayKey = 'nome';
        filterConfig.tagMaxWidth = '800px';
        filterConfig.maxTags = 1;
        filterConfig.onMaxTags = (item, tag) => {
          FLUIGC.toast({
            message: 'Somente um Assinante pode ser selecionado.',
            type: 'danger'
          });
        };
        break;
      case 'searchRazaoSocialForn':
        filterConfig.source.url = '/api/public/ecm/dataset/search?datasetId=dsFinCFODataBR_readView_sync&searchField=NOME&';
        filterConfig.displayKey = 'NOME';
        filterConfig.tagMaxWidth = '800px';
        filterConfig.maxTags = 1;
        filterConfig.onMaxTags = (item, tag) => {
          FLUIGC.toast({
            message: 'Somente uma Razão Social pode ser selecionada.',
            type: 'danger'
          });
        };
        break;

      default:
        console.log('Tipo de Filter não encontrado');
        return null;
    }
    return filterConfig;
  }
  static consultaViaCep(idField){
    //Nova variável "cep" somente com dígitos.
    let cep = $(`#${idField}`).val().replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;
      //Valida o formato do CEP.
      if (validacep.test(cep)) {
        //Preenche os campos com "..." enquanto consulta webservice.
        $("#logradouro").val("...");
        $("#bairro").val("...");
        $("#municipio").val("...");
        $("#estado").val("...");
        //Consulta o webservice viacep.com.br/
        $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
          if (!("erro" in dados)) {
            //Atualiza os campos com os valores da consulta.
            $('#logradouro').val(dados.logradouro);
            $('#bairro').val(dados.bairro);
            $('#municipio').val(dados.localidade);
            $('#estado').val(dados.uf);
          } //end if.
          else {
            //CEP pesquisado não foi encontrado.
            Util.limpa_formulário_cep();
            FLUIGC.toast({
              title: "",
              message: "CEP informado não foi encontrado!",
              type: "warning"
            });
          }
        });
      } //end if.
      else {
        //cep é inválido.
        Util.limpa_formulário_cep();
      }
    } //end if.
    else {
      //cep sem valor, limpa formulário.
      Util.limpa_formulário_cep();
    }
  }
  static limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#logradouro").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#estado").val("");
    $("#municipio").val("");
    $("#numero").val("");
    $("#complemento").val("");

  }

  static consultaCep() {
    $(document).on("ready", function () {       
      //Quando o campo cep perde o foco.
      $("#cep").on("blur", function () {
        if($(`#cep`).val().length == 9){
          Util.consultaViaCep(`cep`)
        }else{
          Util.limpa_formulário_cep();
        }        
      });
      $("#cep").on("keyup", function () {
        if($(`#cep`).val().length == 9){
          Util.consultaViaCep(`cep`)
        }else{
          Util.limpa_formulário_cep();
        }
                
      });
    });
  }
}
