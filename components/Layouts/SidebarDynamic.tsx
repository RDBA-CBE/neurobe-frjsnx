import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toggleSidebar } from "../../store/themeConfigSlice";
import { clearApplicationCount, resetApplicationCount } from "../../store/notificationSlice";
import AnimateHeight from "react-animate-height";
import { IRootState } from "../../store";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import IconCaretsDown from "@/components/Icon/IconCaretsDown";
import IconCaretDown from "@/components/Icon/IconCaretDown";
import IconMinus from "@/components/Icon/IconMinus";
import { menuConfig, OwnmenuConfig, ROLES } from "@/utils/constant.utils";
import Icons from "@/utils/icons.utils";
import Models from "@/imports/models.import";
import { useSetState } from "@mantine/hooks";

const SidebarDynamic = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [showOwn, setShowOwn] = useState<boolean>(true);
  const [showTeam, setShowTeam] = useState<boolean>(true);

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );

  const [notifications, setNotifications] = useState<Record<string, number>>({});
  const applicationCountOverride = useSelector((state: IRootState) => state.notification.applicationCount);
  const pathnameRef = useRef(router.pathname);

  useEffect(() => {
    pathnameRef.current = router.pathname;
  }, [router.pathname]);

  const getNotifyCount = (notifyKey: string) => {
    if (notifyKey === 'new_applications' && applicationCountOverride === 0) return 0;
    return notifications[notifyKey] ?? 0;
  };

  const [state, setState] = useSetState({
    college_id: null,
    institution_id: null
  })

  const toggleMenu = (key: string) => {
    setCurrentMenu((old) => (old === key ? "" : key));
  };

  // Set active route class
  const setActiveRoute = () => {
    const allLinks = document.querySelectorAll(".sidebar ul a.active");
    allLinks.forEach((el) => el.classList.remove("active"));
    const selector = document.querySelector(
      `.sidebar ul a[href="${window.location.pathname}"]`
    );
    selector?.classList.add("active");
  };

  const APPLICATION_PAGES = ["/faculty/my_application", "/faculty/admin_application", "/faculty/ins_application"];

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const path = url.split("?")[0];
      if (APPLICATION_PAGES.includes(path)) {
        setNotifications((prev) => ({ ...prev, new_applications: 0 }));
        dispatch(clearApplicationCount());
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => router.events.off("routeChangeStart", handleRouteChangeStart);
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    if (APPLICATION_PAGES.includes(router.pathname)) {
      setNotifications((prev) => ({ ...prev, new_applications: 0 }));
    } else {
      dispatch(resetApplicationCount());
      getNotification();
    }
  }, [router.pathname]);

  useEffect(() => {
    role();
    profile()
  }, []);

  useEffect(()=> {
    
    getNotification()
  },[state?.college_id, state?.institution_id])

  const role = () => {
    const group = localStorage.getItem("role");
    setGroup(group);
  };

  const profile = async () => {
      try {
        const res: any = await Models.auth.profile();

        if (res?.role == ROLES.INSTITUTION_ADMIN) {
          setState({
            
            institution_id : res?.institution?.id
          })
        } else if (res?.role == ROLES.HR) {
          
            setState({
            college_id : res?.college?.map((item) => item?.college_id),
           
          })
            
        } 
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

  const getNotification = async () => {
    try {
      if (APPLICATION_PAGES.includes(pathnameRef.current)) return;
      const body ={
        college_id : state?.college_id,
        institution_id : state?.institution_id
      }
      const res: any = await Models.notification.list(body);
      const counts: Record<string, number> = {};
      if (res && typeof res === "object") {
        Object.entries(res).forEach(([key, val]: any) => {
          if (val && typeof val === "object") {
            Object.entries(val).forEach(([subKey, count]) => {
              counts[subKey] = Number(count) || 0;
            });
          } else {
            counts[key] = Number(val) || 0;
          }
        });
      }
      setNotifications(counts);
    } catch {}
  };

  // Recursive render function
  const renderMenu = (menu) =>
    menu.map((item, idx) => {
      const Icon = Icons[item.icon];

      if (item.type === "section") {
        return (
          <div key={idx}>
            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
              <IconMinus className="hidden h-5 w-4 flex-none " />
              <span>{t(item.label)}</span>
            </h2>
            <li className="nav-item">
              <ul>{item.children && renderMenu(item.children)}</ul>
            </li>
          </div>
        );
      }

      if (item.type === "link") {
        return (
          <li key={idx} className=" nav-item">
            <Link
              href={item.href || "#"}
              target={item.external ? "_blank" : "_self"}
              className={`group tour-sidebar-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              onClick={() => {
                if (item.notifyKey === 'new_applications') {
                  dispatch(clearApplicationCount());
                  setNotifications((prev) => ({ ...prev, new_applications: 0 }));
                }
              }}
            >
              <div className="w-full flex justify-between items-center " >
                <div className="flex items-center">
                   {Icon && (
                  <Icon className="sidebar-icon shrink-0 !text-white" />
                )}
                <span className="text-white dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                  {t(item.label)}
                </span>
                </div>
                {item.notifyKey && (() => {
                  const count = getNotifyCount(item.notifyKey);
                  return count > 0 ? (
                    <span className="me-2 bg-dblue relative flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white">
                      {count}
                    </span>
                  ) : null;
                })()}
              </div>
            </Link>
          </li>
        );
      }

      if (item.type === "submenu") {
        return (
          <li key={idx} className="menu nav-item">
            <button
              type="button"
              className={`${
                currentMenu === item.key ? "active" : ""
              } nav-link group w-full tour-sidebar-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              onClick={() => toggleMenu(item.key)}
            >
              <div className="flex items-center">
                {Icon && <Icon className="shrink-0 !text-white" />}
                <span className="text-white dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                  {t(item.label)}
                </span>
              </div>
              <div
                className={
                  currentMenu !== item.key ? "-rotate-90 rtl:rotate-90" : ""
                }
              >
                <IconCaretDown />
              </div>
            </button>

            <AnimateHeight
              duration={300}
              height={currentMenu === item.key ? "auto" : 0}
            >
              <ul className="sub-menu text-[#000]">
                {item.children.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>{t(item.label)}</Link>
                  </li>
                ))}
              </ul>
            </AnimateHeight>
          </li>
        );
      }

      return null;
    });

  const getUserMenu = () => {
    if (!group) return menuConfig?.admin;
    return menuConfig?.[group] || menuConfig.default;
  };

  const getOwnMenu = () => {
    if (!group) return OwnmenuConfig.admin;

    return OwnmenuConfig?.[group] || OwnmenuConfig.default;
  };

  

  return (
   <div className={semidark ? "dark" : ""}>
  <nav
    className={`sidebar fixed bottom-0 top-0 z-50 h-full w-[270px] 
      transition-all duration-300 lg:top-[72px] 
      lg:max-h-[calc(100vh-72px)]
      bg-color1
      ${semidark ? "text-white-dark" : ""}`}
  >
    <div className="h-full dark:bg-black">

      {/* Mobile Logo */}
      <div className="block flex items-center justify-between px-3 py-3 lg:hidden">
        <Link href="/" className="main-logo flex shrink-0 items-center">
          <img
            className="ml-[5px] h-[30px] w-[160px] flex-none"
            src="/assets/images/faculty-logo.png"
            alt="logo"
          />
        </Link>

        <button
          type="button"
          className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-white/10 dark:text-white-light"
          onClick={() => dispatch(toggleSidebar())}
        >
          <IconCaretsDown className="m-auto rotate-90" />
        </button>
      </div>

      {/* Sidebar Content */}
      <PerfectScrollbar className="relative h-[calc(100vh-80px)]">

        <div className="px-4 pt-8">

          {/* =========================
              ACTIVE PERSONA ROLE
          ========================== */}
          <div className="mb-7">

            <p className="mb-4 text-[14px] font-medium tracking-[0.5px] text-color-white1">
              ACTIVE PERSONA ROLE
            </p>

            <div
              className="
                flex h-[61px] items-center
                rounded-[10px]
                border border-white/80
                bg-[#000]
                px-3
              "
            >
              {/* Role Icon */}
              <div
                className="
                  flex h-[36px] w-[36px]
                  shrink-0 items-center justify-center
                  overflow-hidden rounded-full
                  bg-white
                "
              >
                <img
                  src="/assets/images/faculty-logo.png"
                  alt="ERP Admin"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Role Details */}
              <div className="ml-3 min-w-0">
                <p className="truncate text-[14px] font-medium tracking-[0.5px] text-white">
                  ERP ADMIN
                </p>

                <p className="mt-[2px] truncate text-[12px] font-medium tracking-[0.5px] text-[#AEB9D6]">
                  MEENA S
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              CORE WORKSPACES
          ========================== */}
          <div>

            <p className="mb-4 text-[14px] font-medium tracking-[0.5px] text-color-white1">
              CORE WORKSPACES
            </p>

            <AnimateHeight duration={300} height={showOwn ? "auto" : 0}>
              <ul className="relative space-y-1 p-0 font-semibold">
                {getOwnMenu()?.length > 0 && renderMenu(getOwnMenu())}
              </ul>
            </AnimateHeight>

          </div>

        </div>

      </PerfectScrollbar>
    </div>
  </nav>
</div>
  );
};

export default SidebarDynamic;
