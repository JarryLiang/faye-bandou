import {DoubanApi} from "/imports/ui/pages/douban-api/DoubanApi";
import GalleryTopicSelector from "/imports/ui/pages/gallery-topic/GalleryTopicSelector";
import GroupManagement from "/imports/ui/pages/group-management/GroupManagement";
import {CreateGroupMission} from "/imports/ui/pages/group-mission/CreateGroupMission";
import MissionManagement from "/imports/ui/pages/MissionManagement/MissionManagement";
import TopicLogPivot from "/imports/ui/pages/pivot/TopicLogPivot";
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import ReactDOM from "react-dom/client";
import 'antd/dist/antd.css';

import Home from "/imports/ui/pages/home";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import {routes} from "/imports/routes";

const router = createBrowserRouter(routes);

Meteor.startup(() => {
  const ele =document.getElementById("react-target");
  // @ts-ignore
  ReactDOM.createRoot(ele).render(
    <RouterProvider router={router} />
  );
});
