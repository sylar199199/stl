/**
 * Created by lidy on 2019/10/24.
 */
// 导入自己需要的组件
import {
  Button,
  Select,
  Option,
  Row,
  Col,
  Input,
  Avatar,
  Carousel,
  CarouselItem,
  Checkbox,
  Form,
  FormItem,
  Popover,
  InfiniteScroll,
  Tag,
  Pagination,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Card,
  Menu,
  MenuItem,
  Loading,
  Upload,
  Badge,
  Dialog,
  Table,
  TableColumn,
  Divider,
  Tooltip,
  Tabs,
  TabPane,
  Progress,
  Radio,
  RadioGroup
} from "element-ui";

const element = {
  install: function(Vue) {
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Avatar);
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(Checkbox);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Popover);
    Vue.use(InfiniteScroll);
    Vue.use(Pagination);
    Vue.use(Card);
    Vue.use(Tag);
    Vue.use(Dropdown);
    Vue.use(DropdownItem);
    Vue.use(DropdownMenu);
    Vue.use(Menu);
    Vue.use(MenuItem);
    Vue.use(Loading);
    Vue.use(Upload);
    Vue.use(Badge);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Dialog);
    Vue.use(Divider);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Tooltip);
    Vue.use(Progress);
    Vue.use(Radio);
    Vue.use(RadioGroup);
  }
};
export default element;
