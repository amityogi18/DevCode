import angular from 'angular';

import companyLogo from './companyLogo--component.js';
import companyProfile from './companyProfile--component.js';
import reporting from './reporting--component.js';
import welcomeVideo from './welcomeVideo--component.js';
import exitVideo from './exitVideo--component.js';
import landingImage from './landingImage--component.js';
import socialMedia from './socialMedia--component.js';
import dialIn from './dialIn--component.js';



const MODULE_NAME = 'settingsComponents';

angular
.module(MODULE_NAME, [])
.component('companyLogo', companyLogo)
.component('companyProfile', companyProfile)
.component('reporting', reporting)
.component('welcomeVideo', welcomeVideo)
.component('exitVideo', exitVideo)
.component('landingImage', landingImage)
.component('socialMedia', socialMedia)
.component('dialIn', dialIn);

export default MODULE_NAME;
