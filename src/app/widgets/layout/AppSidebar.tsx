'use client'
import { useSidebar } from '@/context/SidebarContext'
import { ChevronDownIcon, HorizontaLDots, UserCircleIcon } from '@/icons/index'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import {
  FaBuilding,
  FaEnvelope,
  FaGlobe,
  FaProductHunt,
  FaShieldAlt,
  FaUserAlt,
  FaUsers
} from 'react-icons/fa'
import { MdOutlineArticle, MdOutlineSlideshow } from 'react-icons/md'

type NavItem = {
  name: string
  icon: React.ReactNode
  path?: string
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]
  target?: string
}

const navItems: NavItem[] = [
  {
    name: '輪播管理',
    icon: <MdOutlineSlideshow size={24} />,
    path: '/banners'
  },
  {
    name: '產品服務管理',
    icon: <FaProductHunt size={24} />,
    subItems: [
      { name: '產品服務列表', path: '/services/list', pro: false },
      { name: '產品服務類別列表', path: '/services/category/list', pro: false }
    ]
  },
  {
    name: '媒體活動管理',
    icon: <MdOutlineArticle size={24} />,
    subItems: [
      { name: '媒體活動列表', path: '/news/list', pro: false },
      { name: '媒體活動類別列表', path: '/news/category/list', pro: false }
    ]
  },
  {
    name: '資訊專欄管理',
    icon: <MdOutlineArticle size={24} />,
    subItems: [
      { name: '資訊專欄列表', path: '/blog/list', pro: false },
      { name: '資訊專欄類別列表', path: '/blog/category/list', pro: false }
    ]
  },
  {
    name: '案例分享管理',
    icon: <MdOutlineArticle size={24} />,
    subItems: [
      { name: '案例分享列表', path: '/case/list', pro: false },
      { name: '案例分享類別列表', path: '/case/category/list', pro: false }
    ]
  },
  {
    name: '公司資訊管理',
    icon: <FaBuilding size={24} />,
    path: '/company/info'
  },
  {
    name: '關於我們',
    icon: <FaUserAlt size={24} />,
    path: '/about'
  },
  {
    name: '隱私政策',
    icon: <FaShieldAlt size={24} />,
    path: '/privacy-policy'
  },
  {
    name: '合作客戶管理',
    icon: <FaUsers size={24} />,
    path: '/partners'
  },
  {
    name: '聯絡我們',
    icon: <FaEnvelope size={24} />,
    path: '/contact'
  },
  {
    name: '前台網站',
    icon: <FaGlobe size={24} />,
    target: '_blank',
    path: 'https://www.dynacloud.ai/'
  }
]

const othersItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: '管理員',
    subItems: [{ name: '帳號設定', path: '/admin/profile', pro: false }]
  }
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const pathname = usePathname()

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: 'main' | 'others'
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const menuKey = `${menuType}-${index}`
        const isSubmenuOpen = openSubmenus.has(menuKey)

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${
                  isSubmenuOpen ? 'menu-item-active' : 'menu-item-inactive'
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'lg:justify-start'
                }`}
              >
                <span
                  className={` ${
                    isSubmenuOpen
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                      isSubmenuOpen ? 'rotate-180 text-brand-500' : ''
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  target={nav.target}
                  rel={
                    nav.target === '_blank' ? 'noopener noreferrer' : undefined
                  }
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[menuKey] = el
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen ? `${subMenuHeight[menuKey]}px` : '0px'
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                              } menu-dropdown-badge `}
                            >
                              new
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set())
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname])

  useEffect(() => {
    // Check if the current path matches any submenu item and auto-open those submenus
    const matchedSubmenus = new Set<string>()
    ;['main', 'others'].forEach((menuType) => {
      const items = menuType === 'main' ? navItems : othersItems
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              const key = `${menuType}-${index}`
              matchedSubmenus.add(key)
            }
          })
        }
      })
    })

    // Only update if there are matched submenus
    if (matchedSubmenus.size > 0) {
      queueMicrotask(() => {
        setOpenSubmenus(matchedSubmenus)
      })
    }
  }, [pathname, isActive])

  useEffect(() => {
    // Set the height of the submenu items when any submenu is opened
    const newHeights: Record<string, number> = {}
    openSubmenus.forEach((key) => {
      if (subMenuRefs.current[key]) {
        newHeights[key] = subMenuRefs.current[key]?.scrollHeight || 0
      }
    })
    if (Object.keys(newHeights).length > 0) {
      queueMicrotask(() => {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          ...newHeights
        }))
      })
    }
  }, [openSubmenus])

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    const key = `${menuType}-${index}`
    setOpenSubmenus((prevOpenSubmenus) => {
      const newSet = new Set(prevOpenSubmenus)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={140}
                height={20}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={140}
                height={20}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Others'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, 'others')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
