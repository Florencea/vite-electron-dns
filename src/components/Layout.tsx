import { Layout as AntLayout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/icon.svg";
import { menuItems } from "./menuItems";

const { Content } = AntLayout;

export const Layout = () => {
  const to = useNavigate();
  const { pathname } = useLocation();

  return (
    <AntLayout>
      <header className="fixed z-10 w-full flex justify-between items-center px-6 py-0 bg-[#001529] shadow-sm">
        <div className="w-full text-white tracking-wider text-lg font-bold flex justify-start items-center gap-2">
          <img src={logo} alt="logo" className="w-[36px] h-[36px]" />
          Vite Dreaming Next Sparkling
          <div className="grow">
            <Menu
              theme="dark"
              translate="no"
              items={menuItems}
              selectedKeys={[pathname]}
              defaultOpenKeys={[pathname]}
              mode="horizontal"
              onClick={({ key }) => {
                to(`${key}`);
              }}
            />
          </div>
        </div>
      </header>
      <AntLayout>
        <Content className="flex flex-col h-screen pt-12 overflow-scroll">
          <div className="h-full">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
