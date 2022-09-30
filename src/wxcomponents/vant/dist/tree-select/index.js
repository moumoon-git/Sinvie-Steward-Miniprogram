/*
 * @Descripttion: 
 * @version: 
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-03-02 16:54:13
 */
import { VantComponent } from '../common/component';
VantComponent({
    classes: [
        'main-item-class',
        'content-item-class',
        'main-active-class',
        'content-active-class',
        'main-disabled-class',
        'content-disabled-class',
    ],
    props: {
        items: {
            type: Array,
            observer: 'updateSubItems',
        },
        activeId: null,
        mainActiveIndex: {
            type: Number,
            value: 0,
            observer: 'updateSubItems',
        },
        height: {
            type: null,
            value: 300,
        },
        max: {
            type: Number,
            value: Infinity,
        },
        selectedIcon: {
            type: String,
            value: 'success',
        },
    },
    data: {
        subItems: [],
    },
    methods: {
        // 当一个子项被选择时
        onSelectItem(event) {
            
            const { item } = event.currentTarget.dataset;
            const isArray = Array.isArray(this.data.activeId);
            // 判断有没有超出右侧选择的最大数
            const isOverMax = isArray && this.data.activeId.length >= this.data.max;
            item.activeIndex = this.data.activeId.indexOf(item.id)
            // 判断该项有没有被选中, 如果有被选中，则忽视是否超出的条件
            const isSelected = isArray
                ? item.activeIndex > -1
                : this.data.activeId === item.id;
            item.flag = isSelected
            if (!item.disabled && (!isOverMax || isSelected)) {
                this.$emit('click-item', item);
            }
        },
        // 当一个导航被点击时
        onClickNav(event) {
            const index = event.detail;
            const item = this.data.items[index];
            console.log(item,'999')
            if (!item.disabled) {
                this.$emit('click-nav', { index, item});
            }
        },
        // 更新子项列表
        updateSubItems() {
            const { items, mainActiveIndex } = this.data;
            const { children = [] } = items[mainActiveIndex] || {};
            this.setData({ subItems: children });
        },
    },
});
