import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import * as Chart from 'chart.js';
import { ConsultaApiService } from '../../services/consulta-api.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Service } from '../../models/servicios';

@Component({
  selector: 'app-activationstatus',
  templateUrl: './activationstatus.component.html',
  styleUrls: ['./activationstatus.component.scss'],
})
export class ActivationstatusComponent implements OnInit {
  @HostBinding('class') classes = 'container';
  mainCanvas: any;
  secondCanvas: any;
  mainCtx: any;
  secondCtx: any;
  columnDate: any = [];
  fechaDesde: Object = {};
  fechaHasta: Object = {};
  data: any;
  estadosOperacion: string[] = [];
  estadosRetiro: string[] = [];
  departamentos: string[] = [];
  municipios: string[] = [];
  opcionDepartamento: any = 0;
  stringDepartamento: string = '';
  totalDataSet: number[] = [];
  mainDataSet: number[][] = [];
  labelTable: string[] = [];
  bd_selector: number = 0;
  busqueda: number = 0;

  constructor(private consultaAPIservice: ConsultaApiService) {}

  ngOnInit(): void {}

  getColumn(column: string) {
    this.consultaAPIservice.getConsultaColumnas(column).subscribe((res) => {
      this.columnDate = res;
      let fechaDesde = moment(this.fechaDesde);
      let fechaHasta = moment(this.fechaHasta);
      this.filtrarColumna(fechaDesde, fechaHasta);
    });
  }

  getDataSQL(columna: string) {
    let fechaDesde = moment(this.fechaDesde).format('YYYY-MM-DD');
    let fechaHasta = moment(this.fechaHasta).format('YYYY-MM-DD');
    this.consultaAPIservice
      .getConsultaSQL(fechaDesde, fechaHasta, columna)
      .subscribe((res) => {
        this.data = res;
        this.filtrarEstadosOperacion();
        this.filtrarEstadosRetiro();
        this.filtrarDepartamentos();
        this.llenarContador();
      });
  }

  buscar() {
    if (this.bd_selector == 1) {
      this.getColumn('E');
    } else if (this.bd_selector == 2) {
      this.getDataSQL('fechaActivacion');
    }
  }

  filtrarColumna(fechaDesde: Moment, fechaHasta: Moment) {
    let arregloFechas: any = [];
    let diaA: number = fechaDesde.date();
    let mesA: number = fechaDesde.month();
    let a??oA: number = fechaDesde.year();
    let diaB: number = fechaHasta.date();
    let mesB: number = fechaHasta.month();
    let a??oB: number = fechaHasta.year();
    let fechaA = new Date(a??oA, mesA, diaA);
    let fechaB = new Date(a??oB, mesB, diaB);
    for (let row = 1; row < this.columnDate.length; row++) {
      let element = moment(this.columnDate[row].toString(), 'DD-MM-YYYY');
      if (element == null) {
      } else {
        let dia = element.date();
        let mes = element.month();
        let anio = element.year();
        let fechaActual = new Date(anio, mes, dia);
        if (fechaActual >= fechaA && fechaActual <= fechaB) {
          let rowIndex = row + 1;
          arregloFechas.push(rowIndex);
        }
      }
    }
    this.consultarExtremos(arregloFechas.sort(), fechaA, fechaB);
    arregloFechas = [];
  }

  consultarExtremos(arregloFechas: any, fechaA: Date, fechaB: Date) {
    let izquierda = arregloFechas[0];
    let derecha = arregloFechas[arregloFechas.length - 1];
    this.consultaAPIservice
      .getConsultaDatos(izquierda, derecha)
      .subscribe((res) => {
        this.data = res;
        this.filtrarFechas(this.data, fechaA, fechaB);
      });
  }

  filtrarFechas(data: object[][], fechaA: Date, fechaB: Date) {
    console.log(data);
    let fechaActual, element, dia, mes, anio;
    let fechaSolicitud: string,
      fechaActivacion: string,
      municipio: string,
      departamento: string,
      estadoOperacion: string,
      estadoRetiro: string;
    let arreglo: Array<Service> = [];
    let servicio: Service;
    data.forEach((row) => {
      if (row[3] != undefined) {
        if (
          row[4] == undefined ||
          row[4].toString() == '' ||
          row[4].toString() == ' '
        ) {
          estadoOperacion = 'SIN ESTADO DE OPERACION';
        } else {
          estadoOperacion = row[4].toString();
        }
        if (
          row[5] == undefined ||
          row[5].toString() == '' ||
          row[5].toString() == ' '
        ) {
          estadoRetiro = 'SIN ESTADO DE RETIRO';
        } else {
          estadoRetiro = row[5].toString();
        }
        fechaSolicitud = row[0].toString();
        municipio = row[1].toString();
        departamento = row[2].toString();
        fechaActivacion = row[3].toString();
        element = moment(row[3].toString(), 'DD-MM-YYYY');
        dia = element.date();
        mes = element.month();
        anio = element.year();
        fechaActual = new Date(anio, mes, dia);
        if (fechaActual >= fechaA && fechaActual <= fechaB) {
          servicio = {
            fechaSolicitud: fechaSolicitud,
            municipio: municipio,
            departamento: departamento,
            fechaActivacion: fechaActivacion,
            estadoOperacion: estadoOperacion,
            estadoRetiro: estadoRetiro,
          };

          arreglo.push(servicio);
        }
      }
    });
    this.data = arreglo;
    this.filtrarEstadosOperacion();
    this.filtrarEstadosRetiro();
    this.filtrarDepartamentos();
    this.llenarContador();
  }

  filtrarEstadosOperacion() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      aux.push(element.estadoOperacion);
    });
    this.estadosOperacion = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.estadosOperacion.sort();
  }

  filtrarEstadosRetiro() {
    let aux: any = [];
    this.data.forEach((element: any) => {
      aux.push(element.estadoRetiro);
    });
    this.estadosRetiro = aux.filter((item: any, index: any) => {
      return aux.indexOf(item) === index;
    });
    this.estadosRetiro.sort();
  }
  filtrarDepartamentos() {
    let aux: any = [];
    this.data.map((element: any) => {
      aux.push(element.departamento);
    });
    this.departamentos = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.departamentos.sort();
  }

  filtrarMunicipios(departamento: string) {
    let aux: any = [];
    this.data.forEach((element: any) => {
      if (element.departamento == departamento) {
        aux.push(element.municipio);
      }
    });
    this.municipios = aux.filter((item: any, index: any) => {
      return aux.indexOf(item.trim()) === index;
    });
    this.municipios.sort();
  }

  llenarContador() {
    let labelGrafica: any = [];
    let lDatos = this.estadosOperacion;
    let datos = Array(this.departamentos.length);
    let contadores = Array(this.estadosOperacion.length);
    if (this.opcionDepartamento == '0') {
      labelGrafica = this.departamentos;
      for (let i = 0; i < this.departamentos.length; i++) {
        contadores.length = this.estadosOperacion.length;
        contadores.fill(0);
        this.data.forEach((servicio: any) => {
          for (let j = 0; j < contadores.length; j++) {
            if (
              this.departamentos[i] === servicio.departamento &&
              this.estadosOperacion[j] === servicio.estadoOperacion
            ) {
              contadores[j]++;
            }
          }
        });
        datos[i] = contadores;
        contadores = [];
      }
    } else if (this.opcionDepartamento != 0) {
      this.filtrarMunicipios(this.opcionDepartamento);
      labelGrafica = this.municipios;
      for (let i = 0; i < this.municipios.length; i++) {
        contadores.length = this.estadosOperacion.length;
        contadores.fill(0);
        this.data.forEach((servicio: any) => {
          for (let j = 0; j < contadores.length; j++) {
            if (
              this.municipios[i] === servicio.municipio &&
              this.estadosOperacion[j] === servicio.estadoOperacion
            ) {
              contadores[j]++;
            }
          }
        });
        datos[i] = contadores;
        contadores = [];
      }
    }
    for (let i = 0; i < datos.length; i++) {
      let initialValue = 0;
      let sumWithInitial = datos[i].reduce(
        (previousValue: any, currentValue: any) => previousValue + currentValue,
        initialValue
      );
      datos[i].push(sumWithInitial);
    }
    this.crearObjetoDatasetMainChart(labelGrafica, datos, lDatos);
    this.crearObjetoDataSetTotal(labelGrafica, datos, lDatos);
  }

  crearObjetoDatasetMainChart(labelGrafica: any, datos: any, lDatos: any) {
    let dataSet: Array<Object> = [];
    let ArregloDatos: Array<number> = [];
    let arregloTabla: Array<Array<number>> = [];

    for (let i = 0; i < lDatos.length; i++) {
      for (let j = 0; j < datos.length; j++) {
        let aux = datos[j][i];
        if (aux === undefined) {
          ArregloDatos.push(0);
        } else {
          ArregloDatos.push(aux);
        }
      }
      if (lDatos[i] == '') {
        let objeto = {
          data: ArregloDatos,
          label: 'SIN ESTADO DE OPERACION',
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(153, 202, 255, 0.5)',
            'rgba(255, 109, 64, 0.5)',
          ],
          borderWidth: 1,
        };
        arregloTabla.push(ArregloDatos);
        dataSet.push(objeto);
        ArregloDatos = [];
      } else {
        let objeto = {
          data: ArregloDatos,
          label: lDatos[i],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(153, 202, 255, 0.5)',
            'rgba(255, 109, 64, 0.5)',
          ],
          borderWidth: 1,
        };
        arregloTabla.push(ArregloDatos);
        dataSet.push(objeto);
        ArregloDatos = [];
      }
    }
    this.mainDataSet = datos;
    this.llenarMainChart(labelGrafica, dataSet);
  }

  llenarMainChart(labelGrafica: any, dataSet: Array<object>) {
    this.mainCanvas = document.getElementById('graficaPrincipal');
    this.mainCtx = this.mainCanvas.getContext('2d');
    let myChart = new Chart(this.mainCtx, {
      type: 'bar',
      data: {
        labels: labelGrafica,
        datasets: dataSet,
      },
      options: {
        legend: {
          display: true,
          position: 'right',
        },
        datalabels: {
          color: 'black',
          anchor: 'center',
          align: 'end',
        },
        responsive: false,
        display: true,
      },
    });
  }

  crearObjetoDataSetTotal(labelGrafica: any, datos: any, lDatos: any) {
    let dataSet: Array<Object> = [];
    let ArregloDatos: Array<number> = [];
    let arregloLabel: Array<string> = [];
    let totalizador: Array<number> = [];
    for (let i = 0; i < lDatos.length; i++) {
      for (let j = 0; j < datos.length; j++) {
        let aux: number = datos[j][i];
        if (aux === undefined) {
          ArregloDatos.push(0);
        } else {
          ArregloDatos.push(aux);
        }
      }
      let initialValue = 0;
      let sumWithInitial = ArregloDatos.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
      );
      if (lDatos[i] == '') {
        let objeto = {
          data: [sumWithInitial],
          label: 'SIN ESTADO DE OPERACIONaa',
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(153, 202, 255, 0.5)',
            'rgba(255, 109, 64, 0.5)',
          ],
          borderWidth: 1,
        };
        totalizador.push(sumWithInitial);
        dataSet.push(objeto);
        arregloLabel.push('SIN ESTADO DE OPERACION');
        ArregloDatos = [];
      } else {
        let objeto = { data: [sumWithInitial], 
          label: lDatos[i],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(153, 202, 255, 0.5)',
            'rgba(255, 109, 64, 0.5)',
          ],
          borderWidth: 1, };
        totalizador.push(sumWithInitial);
        dataSet.push(objeto);
        arregloLabel.push(lDatos[i]);
        ArregloDatos = [];
      }
    }

    let valorInicial = 0;
    let sumaTotal = totalizador.reduce(
      (valorAnterior: any, valorActual: any) => valorAnterior + valorActual,
      valorInicial
    );
    arregloLabel.push('TOTAL');
    this.labelTable = arregloLabel;
    this.totalDataSet = totalizador;
    this.totalDataSet.push(sumaTotal);
    this.llenarSecondChart(dataSet);
    this.busqueda = 1;
  }

  llenarSecondChart(dataSet: Array<object>) {
    if (this.opcionDepartamento == 0) {
      this.stringDepartamento = 'DEPARTAMENTOS';
      this.secondCanvas = document.getElementById('graficaSecundaria');
      this.secondCtx = this.secondCanvas.getContext('2d');
      let myChart = new Chart(this.secondCtx, {
        type: 'bar',
        data: {
          labels: [this.stringDepartamento],
          datasets: dataSet,
        },
        options: {
          legend: {
            display: true,
            position: 'right',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'end',
          },
          responsive: false,
          display: true,
        },
      });
    } else {
      this.stringDepartamento = this.opcionDepartamento;
      this.secondCanvas = document.getElementById('graficaSecundaria');
      this.secondCtx = this.secondCanvas.getContext('2d');
      let myChart = new Chart(this.secondCtx, {
        type: 'bar',
        data: {
          labels: [this.stringDepartamento],
          datasets: dataSet,
        },
        options: {
          legend: {
            display: true,
            position: 'right',
          },
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'end',
          },
          responsive: false,
          display: true,
        },
      });
    }
  }
}
