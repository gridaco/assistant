import ReactGA from 'react-ga';

export function initialize(){
    ReactGA.initialize('G-8WGR5NZPJR');
    ReactGA.pageview(window.location.pathname + window.location.search);
}