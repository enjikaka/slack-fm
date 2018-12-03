import * as Web from '../web.js';
import LastFM from '../../lastfm.js';
import { setStatus, resetStatusesFromBeforeScrobbling } from '../../slack.js';


class LastFmNowPlaying extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      title: '',
      artist: '',
      coverImageSrc: '',
      coverImageSrcSet: ''
    };
  }

  static get observedAttributes () {
    return ['user'];
  }

  async componentDidUpdate () {
    const scrobblingTrack = await LastFM['User.getScrobblingTrack'](this.props.user);
    const coverImageSrcSet = scrobblingTrack.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

    this.state = {
      ...scrobblingTrack,
      coverImageSrc: scrobblingTrack.image[0].url,
      coverImageSrcSet
    };
  }

  async componentDidMount () {
    const scrobblingTrack = await LastFM['User.getScrobblingTrack'](this.props.user);
    const coverImageSrcSet = scrobblingTrack.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

    if (scrobblingTrack) {
      setStatus(`${scrobblingTrack.artist} - ${scrobblingTrack.title}`).then(console.log);

      this.state = {
        ...scrobblingTrack,
        coverImageSrc: scrobblingTrack.image[0].url,
        coverImageSrcSet
      };
    }

    setInterval(async () => {
      const scrobblingTrack = await LastFM['User.getScrobblingTrack'](this.props.user);

      if (!scrobblingTrack) {
        resetStatusesFromBeforeScrobbling();
        return;
      }

      const coverImageSrcSet = scrobblingTrack.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

      if (scrobblingTrack.url !== this.state.url) {
        setStatus(`${scrobblingTrack.artist} - ${scrobblingTrack.title}`).then(console.log);

        this.state = {
          ...scrobblingTrack,
          coverImageSrc: scrobblingTrack.image[0].url,
          coverImageSrcSet
        };
      }
    }, 5000);
  }

  render () {
    return Web.html`
      <figure>
        <img
          src="${this.state.coverImageSrc}"
          srcset="${this.state.coverImageSrcSet}"
          sizes="128px"
          alt="Profile image"
        >
      </figure>
      <div class="col">
        <span>${this.state.title}</span>
        <span>${this.state.artist}</span>
      </div>
    `;
  }
}

export default Web.registerComponent(LastFmNowPlaying);
