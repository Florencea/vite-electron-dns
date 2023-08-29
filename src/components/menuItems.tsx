import { GlobalOutlined, SecurityScanOutlined } from "@ant-design/icons";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { fromPairs } from "lodash-es";

export const menuItems: MenuItemType[] = [
  {
    key: "/dns",
    label: "DNS",
    icon: <GlobalOutlined />,
  },
  {
    key: "/doh",
    label: "DNS over HTTPS",
    icon: <SecurityScanOutlined />,
  },
];

export const routeNamesMap = fromPairs(menuItems.map((m) => [m.key, m.label]));
