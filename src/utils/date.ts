import dayjs from 'dayjs';

export default {
  /**
   * 格式化日期
   * @param date
   * @param format
   */
  formatDate(date: string | Date | number, format = 'YYYY-MM-DD') {
    return dayjs(date).format(format);
  },

  /**
   * 当前月是否是大月
   * @param {*} month
   */
  isBigMonth(month: number) {
    return [1, 3, 5, 7, 8, 10, 12].includes(month);
  },
};
