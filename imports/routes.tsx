import AsyncLockStatus from "/imports/ui/pages/async-lock-status/AsyncLockStatus";
import {DoubanApi} from "/imports/ui/pages/douban-api/DoubanApi";
import GalleryTopicSelector from "/imports/ui/pages/gallery-topic/GalleryTopicSelector";
import {CreateGroupMission} from "/imports/ui/pages/group-mission/CreateGroupMission";
import Home from "/imports/ui/pages/home";
import MissionStatus from "/imports/ui/pages/mission-status";
import MissionManagement from "/imports/ui/pages/MissionManagement/MissionManagement";
import TopicLogPivot from "/imports/ui/pages/pivot/TopicLogPivot";
import React from "react";


export const routes = [
  {
    path: "/",
    element: <Home />,
    title:"Home"
  },
  {
    path: "/mission_status",
    element: <MissionStatus />,
    title:"Mission Status"
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
