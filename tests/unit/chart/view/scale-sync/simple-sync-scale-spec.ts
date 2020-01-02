import 'jest-extended';
import { Chart } from '../../../../../src';
import { CITY_SALE_PROFIT } from '../../../../util/data';
import { createDiv } from '../../../../util/dom';

describe('sync scale', () => {
  const container = createDiv();
  const chart = new Chart({
    container,
    height: 500,
    width: 600,
    padding: 32,
  });
  chart.data(CITY_SALE_PROFIT);

  chart
    .interval()
    .position('city*sale')
    .color('category')
    .adjust('stack');
  chart
    .line()
    .position('city*profit')
    .color('category');

  it('no sync', () => {
    chart.render();
    const sale = chart.getScaleByField('sale');
    const profit = chart.getScaleByField('profit');

    // 未同步，不相同
    expect(sale.min).toBe(0);
    expect(sale.max).toBe(320);
    expect(profit.min).toBe(0);
    expect(profit.max).toBe(150);
    // @ts-ignore
    expect(Object.keys(chart.scalePool.scales).length).toBe(4);
    // @ts-ignore
    expect(Object.keys(chart.scalePool.syncScales).length).toBe(0);
  });

  it('sync scale, and update', () => {
    chart.scale({
      sale: {
        sync: 'value',
      },
      profit: {
        sync: 'value',
      },
    });

    chart.render();

    const sale = chart.getScaleByField('sale');
    const profit = chart.getScaleByField('profit');

    // 相等的 min max
    expect(sale.min).toBe(0);
    expect(sale.max).toBe(320);
    expect(profit.min).toBe(0);
    expect(profit.max).toBe(320);
    // @ts-ignore
    expect(Object.keys(chart.scalePool.syncScales).length).toBe(1);
    // @ts-ignore
    expect(chart.scalePool.syncScales.value.length).toBe(2);
  });

  it('sync = false', () => {
    chart.scale({
      sale: {
        sync: false,
      },
      profit: {
        sync: false,
      },
    });

    chart.render();

    const sale = chart.getScaleByField('sale');
    const profit = chart.getScaleByField('profit');

    // 未同步，不相同
    expect(sale.min).toBe(0);
    expect(sale.max).toBe(320);
    expect(profit.min).toBe(0);
    expect(profit.max).toBe(150);
    // @ts-ignore
    expect(Object.keys(chart.scalePool.scales).length).toBe(4);
    // @ts-ignore
    expect(Object.keys(chart.scalePool.syncScales).length).toBe(0);
  });
});