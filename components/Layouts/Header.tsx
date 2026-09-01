import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { IRootState } from "../../store";
import {
  toggleLocale,
  toggleTheme,
  toggleSidebar,
  toggleRTL,
} from "../../store/themeConfigSlice";
import { useTranslation } from "react-i18next";
import Dropdown from "../Dropdown";
import IconMenu from "@/components/Icon/IconMenu";
import IconCalendar from "@/components/Icon/IconCalendar";
import IconEdit from "@/components/Icon/IconEdit";
import IconChatNotification from "@/components/Icon/IconChatNotification";
import IconSearch from "@/components/Icon/IconSearch";
import IconXCircle from "@/components/Icon/IconXCircle";
import IconSun from "@/components/Icon/IconSun";
import IconMoon from "@/components/Icon/IconMoon";
import IconLaptop from "@/components/Icon/IconLaptop";
import IconMailDot from "@/components/Icon/IconMailDot";
import IconArrowLeft from "@/components/Icon/IconArrowLeft";
import IconInfoCircle from "@/components/Icon/IconInfoCircle";
import IconBellBing from "@/components/Icon/IconBellBing";
import IconUser from "@/components/Icon/IconUser";
import IconMail from "@/components/Icon/IconMail";
import IconLockDots from "@/components/Icon/IconLockDots";
import IconLogout from "@/components/Icon/IconLogout";
import IconMenuDashboard from "@/components/Icon/Menu/IconMenuDashboard";
import IconCaretDown from "@/components/Icon/IconCaretDown";
import IconMenuApps from "@/components/Icon/Menu/IconMenuApps";
import IconMenuComponents from "@/components/Icon/Menu/IconMenuComponents";
import IconMenuElements from "@/components/Icon/Menu/IconMenuElements";
import IconMenuDatatables from "@/components/Icon/Menu/IconMenuDatatables";
import IconMenuForms from "@/components/Icon/Menu/IconMenuForms";
import IconMenuPages from "@/components/Icon/Menu/IconMenuPages";
import IconMenuMore from "@/components/Icon/Menu/IconMenuMore";
import { capitalizeFLetter, useSetState } from "@/utils/function.utils";
import { userData } from "@/store/userConfigSlice";
import Models from "@/imports/models.import";
import IconCaretsDown from "../Icon/IconCaretsDown";
import { TOUR_KEY } from "@/components/DashboardTour";
import { STEPS_BY_ROUTE } from "@/components/DashboardTour";
import { FaWalking } from "react-icons/fa";
import IconHandWave from "../Icon/IconHandWave";

const Header = () => {
  const router = useRouter();

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl"
      ? true
      : false;

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  const users = useSelector((state: any) => state.userData);

  const [flag, setFlag] = useState("");

  const [state, setState] = useSetState({
    userInfo: {},
    token: "",
  });

  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      const all: any = document.querySelectorAll(
        "ul.horizontal-menu .nav-link.active",
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove("active");
      }

      let allLinks = document.querySelectorAll("ul.horizontal-menu a.active");
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove("active");
      }
      selector?.classList.add("active");

      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link");
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add("active");
          });
        }
      }
    }
  }, [router.pathname]);

  const setLocale = (flag: string) => {
    setFlag(flag);
    if (flag.toLowerCase() === "ae") {
      dispatch(toggleRTL("rtl"));
    } else {
      dispatch(toggleRTL("ltr"));
    }
  };

  useEffect(() => {
    setLocale(localStorage.getItem("i18nextLng") || themeConfig.locale);
  }, []);

  useEffect(() => {
    if (!users) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    try {
      const userString = localStorage.getItem("userId");
      if (userString) {
        const res: any = {};
        console.log("getUserRole --->", res);
        setState({
          name:
            res?.first_name && res?.last_name
              ? `${capitalizeFLetter(res?.first_name)} ${res?.last_name}`
              : capitalizeFLetter(res?.username),
          user_type: capitalizeFLetter(res?.role_display),
          email: res?.email,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const getUserData = async () => {
    try {
      const userString = localStorage.getItem("userId");
      // const res = await Models.user.details(userString);
      // console.log("✌️res --->", res);

      //   dispatch(userData(res));

      const token = localStorage.getItem("token");

      console.log("token", token);

      //   const user = userString ? JSON.parse(userString) : null;
      setState({ token: token });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onLogOut = async () => {
    try {
      const reFreshToken = localStorage.getItem("refresh");
      const body = {
        refresh: reFreshToken,
      };
      // const res: any = await Models.auth.logout(body).then(() => {
      //   localStorage.clear();
      //   sessionStorage.clear();
      //   router.replace("/auth/signin");
      // });
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/auth/signin");
      console.log("error: ", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const checkValidToken = async () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/auth/signin");
  };

  function createMarkup(messages: any) {
    return { __html: messages };
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
      title: "Congratulations!",
      message: "Your OS has been updated.",
      time: "1hr",
    },
    {
      id: 2,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
      title: "Did you know?",
      message: "You can switch between artboards.",
      time: "2hr",
    },
    {
      id: 3,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
      title: "Something went wrong!",
      message: "Send Reposrt",
      time: "2days",
    },
    {
      id: 4,
      image:
        '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
      title: "Warning",
      message: "Your password strength is low.",
      time: "5days",
    },
  ]);

  const removeMessage = (value: number) => {
    setMessages(messages.filter((user) => user.id !== value));
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: "user-profile.jpeg",
      message:
        '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: "45 min ago",
    },
    {
      id: 2,
      profile: "profile-34.jpeg",
      message:
        '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
      time: "9h Ago",
    },
    {
      id: 3,
      profile: "profile-16.jpeg",
      message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
      time: "9h Ago",
    },
  ]);

  const removeNotification = (value: number) => {
    setNotifications(notifications.filter((user) => user.id !== value));
  };

  return (
    <header
      className={`z-40 ${
        themeConfig.semidark && themeConfig.menu === "horizontal" ? "dark" : ""
      }`}
    >
      <div className="bg-[#fff]">
        <div className="bg-lblue border-lblue z-2 relative flex w-full items-center border-b  dark:bg-black">

          {/* logo */}
          <div className="bg-color1 px-1  py-1 logo-bg-parent">
            <div className="horizontal-logo flex items-center justify-between px-7 py-4  bg-[#fff] rounded-md logo-bg">
              <Link href="/" className="main-logo flex shrink-0 items-center">
                <img
                  className="inline h-[30px] w-[170px] ltr:-ml-1 rtl:-mr-1"
                  src="/assets/images/faculty-logo.png"
                  alt="logo"
                />
                {/* <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 dark:text-white-light md:inline ltr:ml-1.5 rtl:mr-1.5">
                Faculty Pro
              </span> */}
              </Link>
              <button
                type="button"
                className="side-arrow-icon collapse-icon flex hidden h-8 w-8 items-center rounded-full transition duration-300 hover:bg-color2-l dark:text-white-light dark:hover:bg-dark-light/10 lg:block ltr:ml-2 rtl:mr-2 rtl:rotate-180"
                onClick={() => dispatch(toggleSidebar())}
              >
                <IconCaretsDown className="m-auto rotate-90 text-color2" />
              </button>
              <button
                type="button"
                className="collapse-icon flex flex-none rounded-full bg-color2-l text-color2 p-2 hover:bg-white hover:border hover:border-color2-l hover:text-color2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden ltr:ml-2 rtl:mr-2"
                onClick={() => dispatch(toggleSidebar())}
              >
                <IconMenu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* greeting */}
          <div className="ltr:ml-6 rtl:mr-6 flex-1">
            <p className="text-xl font-bold text-[#000] dark:text-white flex gap-4 items-center">
              {getGreeting()}, {state.name} <IconHandWave />
            </p>
          </div>

          {/* right actions */}
          <div className="flex items-center gap-4 ltr:mr-4 rtl:ml-4">
            {/* notification bell */}
            <button
              type="button"
              className="me-3  relative flex h-12 w-12 items-center justify-center rounded-full bg-[#ECE3FC] text-[#000] hover:bg-[#e0e3ff]"
            >
              <IconBellBing className="h-6 w-6" />
              <span className="absolute right-3.5 top-3 h-2 w-2 rounded-full bg-red-600 border border-[#fff]"></span>
            </button>

            {/* user info + avatar */}
            <div className="flex items-center gap-3  border-l px-5">
              <div className="tour-profile bg-color1 text-lg flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-lg">
                {/* {state.name?.charAt(0)?.toUpperCase()}  */}
                K
                
              </div>
              <div className=" text-left sm:block">
                <p className="text-md font-bold text-[#000]">Karpagam Admin</p>
                <p className="text-xs text-color2">ERP admin</p>
              </div>
              
            </div>

            {/* logout */}
            <button
              type="button"
              onClick={() => (state.token ? onLogOut() : checkValidToken())}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#000] text-[#fff]] "
            >
              <IconLogout className="h-4.5 w-4.5 rotate-90 text-[#fff] ms-1" />
            </button>
          </div>
        </div>

        {/* horizontal menu */}
        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse">
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuDashboard className="shrink-0" />
                <span className="px-1">{t("dashboard")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/">{t("sales")}</Link>
              </li>
              <li>
                <Link href="/analytics">{t("analytics")}</Link>
              </li>
              <li>
                <Link href="/finance">{t("finance")}</Link>
              </li>
              <li>
                <Link href="/crypto">{t("crypto")}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuApps className="shrink-0" />
                <span className="px-1">{t("apps")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/apps/chat">{t("chat")}</Link>
              </li>
              <li>
                <Link href="/apps/mailbox">{t("mailbox")}</Link>
              </li>
              <li>
                <Link href="/apps/todolist">{t("todo_list")}</Link>
              </li>
              <li>
                <Link href="/apps/notes">{t("notes")}</Link>
              </li>
              <li>
                <Link href="/apps/scrumboard">{t("scrumboard")}</Link>
              </li>
              <li>
                <Link href="/apps/contacts">{t("contacts")}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t("invoice")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/apps/invoice/list">{t("list")}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/preview">{t("preview")}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/add">{t("add")}</Link>
                  </li>
                  <li>
                    <Link href="/apps/invoice/edit">{t("edit")}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/apps/calendar">{t("calendar")}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuComponents className="shrink-0" />
                <span className="px-1">{t("components")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/components/tabs">{t("tabs")}</Link>
              </li>
              <li>
                <Link href="/components/accordions">{t("accordions")}</Link>
              </li>
              <li>
                <Link href="/components/modals">{t("modals")}</Link>
              </li>
              <li>
                <Link href="/components/cards">{t("cards")}</Link>
              </li>
              <li>
                <Link href="/components/carousel">{t("carousel")}</Link>
              </li>
              <li>
                <Link href="/components/countdown">{t("countdown")}</Link>
              </li>
              <li>
                <Link href="/components/counter">{t("counter")}</Link>
              </li>
              <li>
                <Link href="/components/sweetalert">{t("sweet_alerts")}</Link>
              </li>
              <li>
                <Link href="/components/timeline">{t("timeline")}</Link>
              </li>
              <li>
                <Link href="/components/notifications">
                  {t("notifications")}
                </Link>
              </li>
              <li>
                <Link href="/components/media-object">{t("media_object")}</Link>
              </li>
              <li>
                <Link href="/components/list-group">{t("list_group")}</Link>
              </li>
              <li>
                <Link href="/components/pricing-table">
                  {t("pricing_tables")}
                </Link>
              </li>
              <li>
                <Link href="/components/lightbox">{t("lightbox")}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuElements className="shrink-0" />
                <span className="px-1">{t("elements")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/elements/alerts">{t("alerts")}</Link>
              </li>
              <li>
                <Link href="/elements/avatar">{t("avatar")}</Link>
              </li>
              <li>
                <Link href="/elements/badges">{t("badges")}</Link>
              </li>
              <li>
                <Link href="/elements/breadcrumbs">{t("breadcrumbs")}</Link>
              </li>
              <li>
                <Link href="/elements/buttons">{t("buttons")}</Link>
              </li>
              <li>
                <Link href="/elements/buttons-group">{t("button_groups")}</Link>
              </li>
              <li>
                <Link href="/elements/color-library">{t("color_library")}</Link>
              </li>
              <li>
                <Link href="/elements/dropdown">{t("dropdown")}</Link>
              </li>
              <li>
                <Link href="/elements/infobox">{t("infobox")}</Link>
              </li>
              <li>
                <Link href="/elements/jumbotron">{t("jumbotron")}</Link>
              </li>
              <li>
                <Link href="/elements/loader">{t("loader")}</Link>
              </li>
              <li>
                <Link href="/elements/pagination">{t("pagination")}</Link>
              </li>
              <li>
                <Link href="/elements/popovers">{t("popovers")}</Link>
              </li>
              <li>
                <Link href="/elements/progress-bar">{t("progress_bar")}</Link>
              </li>
              <li>
                <Link href="/elements/search">{t("search")}</Link>
              </li>
              <li>
                <Link href="/elements/tooltips">{t("tooltips")}</Link>
              </li>
              <li>
                <Link href="/elements/treeview">{t("treeview")}</Link>
              </li>
              <li>
                <Link href="/elements/typography">{t("typography")}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuDatatables className="shrink-0" />
                <span className="px-1">{t("tables")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/tables">{t("tables")}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t("datatables")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/datatables/basic">{t("basic")}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/advanced">{t("advanced")}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/skin">{t("skin")}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/order-sorting">
                      {t("order_sorting")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/datatables/multi-column">
                      {t("multi_column")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/datatables/multiple-tables">
                      {t("multiple_tables")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/datatables/alt-pagination">
                      {t("alt_pagination")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/datatables/checkbox">{t("checkbox")}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/range-search">
                      {t("range_search")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/datatables/export">{t("export")}</Link>
                  </li>
                  <li>
                    <Link href="/datatables/column-chooser">
                      {t("column_chooser")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuForms className="shrink-0" />
                <span className="px-1">{t("forms")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/forms/basic">{t("basic")}</Link>
              </li>
              <li>
                <Link href="/forms/input-group">{t("input_group")}</Link>
              </li>
              <li>
                <Link href="/forms/layouts">{t("layouts")}</Link>
              </li>
              <li>
                <Link href="/forms/validation">{t("validation")}</Link>
              </li>
              <li>
                <Link href="/forms/input-mask">{t("input_mask")}</Link>
              </li>
              <li>
                <Link href="/forms/select2">{t("select2")}</Link>
              </li>
              <li>
                <Link href="/forms/touchspin">{t("touchspin")}</Link>
              </li>
              <li>
                <Link href="/forms/checkbox-radio">
                  {t("checkbox_and_radio")}
                </Link>
              </li>
              <li>
                <Link href="/forms/switches">{t("switches")}</Link>
              </li>
              <li>
                <Link href="/forms/wizards">{t("wizards")}</Link>
              </li>
              <li>
                <Link href="/forms/file-upload">{t("file_upload")}</Link>
              </li>
              <li>
                <Link href="/forms/quill-editor">{t("quill_editor")}</Link>
              </li>
              <li>
                <Link href="/forms/markdown-editor">
                  {t("markdown_editor")}
                </Link>
              </li>
              <li>
                <Link href="/forms/date-picker">
                  {t("date_and_range_picker")}
                </Link>
              </li>
              <li>
                <Link href="/forms/clipboard">{t("clipboard")}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuPages className="shrink-0" />
                <span className="px-1">{t("pages")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li className="relative">
                <button type="button">
                  {t("users")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/users/profile">{t("profile")}</Link>
                  </li>
                  <li>
                    <Link href="/users/user-account-settings">
                      {t("account_settings")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/pages/knowledge-base">{t("knowledge_base")}</Link>
              </li>
              <li>
                <Link href="/pages/contact-us-boxed" target="_blank">
                  {t("contact_us_boxed")}
                </Link>
              </li>
              <li>
                <Link href="/pages/contact-us-cover" target="_blank">
                  {t("contact_us_cover")}
                </Link>
              </li>
              <li>
                <Link href="/pages/faq">{t("faq")}</Link>
              </li>
              <li>
                <Link href="/pages/coming-soon-boxed" target="_blank">
                  {t("coming_soon_boxed")}
                </Link>
              </li>
              <li>
                <Link href="/pages/coming-soon-cover" target="_blank">
                  {t("coming_soon_cover")}
                </Link>
              </li>
              <li>
                <Link href="/pages/maintenence" target="_blank">
                  {t("maintenence")}
                </Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t("error")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/pages/error404" target="_blank">
                      {t("404")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/error500" target="_blank">
                      {t("500")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/error503" target="_blank">
                      {t("503")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t("login")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/auth/cover-login" target="_blank">
                      {t("login_cover")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-signin" target="_blank">
                      {t("login_boxed")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t("register")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/auth/cover-register" target="_blank">
                      {t("register_cover")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-signup" target="_blank">
                      {t("register_boxed")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t("password_recovery")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/auth/cover-password-reset" target="_blank">
                      {t("recover_id_cover")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-password-reset" target="_blank">
                      {t("recover_id_boxed")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t("lockscreen")}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                  <li>
                    <Link href="/auth/cover-lockscreen" target="_blank">
                      {t("unlock_cover")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/boxed-lockscreen" target="_blank">
                      {t("unlock_boxed")}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuMore className="shrink-0" />
                <span className="px-1">{t("more")}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link href="/dragndrop">{t("drag_and_drop")}</Link>
              </li>
              <li>
                <Link href="/charts">{t("charts")}</Link>
              </li>
              <li>
                <Link href="/font-icons">{t("font_icons")}</Link>
              </li>
              <li>
                <Link href="/widgets">{t("widgets")}</Link>
              </li>
              <li>
                <Link href="https://vristo.sbthemes.com" target="_blank">
                  {t("documentation")}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
