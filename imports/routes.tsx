import AsyncLockStatus from "/imports/ui/pages/async-lock-status/AsyncLockStatus";
import {DoubanApi} from "/imports/ui/pages/douban-api/DoubanApi";
import GalleryTopicSelector from "/imports/ui/pages/gallery-topic/GalleryTopicSelector";
import {CreateGroupMission} from "/imports/ui/pages/group-mission/CreateGroupMission";
import Home from "/imports/ui/pages/home";
import MigrateToRemote from "/imports/ui/pages/migrate-to-remote";
import MissionStatus from "/imports/ui/pages/mission-status";
import MissionManagement from "/imports/ui/pages/MissionManagement/MissionManagement";
import MonitorAWSPage from "/imports/ui/pages/monitor-aws-page";
import TopicLogPivot from "/imports/ui/pages/pivot/TopicLogPivot";
import React from "react";


export const routes = [
  {
    path: "/",
    element: <Home />,
    title:"Home"
  },
  {
    path: "/monitor_aws",
    element: <MonitorAWSPage />,
    title:"AWS Monitor"
  },
  {
    path: "/mission_status",
    element: <MissionStatus />,
    title:"Mission Status"
  },
  {
    path: "/mission_migrate",
    element: <MigrateToRemote />,
    title:"Download To Migrate"
  },
  {
    path: "/async_lock",
    element: <AsyncLockStatus />,
    title:"Async Lock Test"
  },
  {
    path: "/create_group_mission",
    element: <CreateGroupMission />,
    title:"Group Mission"
  },
  {
    path: "/api",
    element: <DoubanApi />,
    title:"Douban Api"
  },
  {
    path: "/gallerytopic",
    element: <GalleryTopicSelector />,
    title:"話題選擇與過濾"
  },
  {
    path: "/mission",
    element: <MissionManagement />,
    title:"小組擷取任務"
  },
  {
    path: "/pivot",
    element: <TopicLogPivot />,
    title:"Pivot"
  }
]
