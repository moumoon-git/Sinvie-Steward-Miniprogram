import { VantComponent } from '../common/component';
VantComponent({
  props: {
    value: String,
    placement: {
      type: String,
      value: 'bottom',
    },
    theme: {
      type: String,
      value: 'dark',
    },
  },
  data: {
    show: false,
  },
  methods: {
    onClickSource() {
      this.data.show
        ? this.setData({ show: false })
        : this.setData({ show: true });
    },
  },
});
