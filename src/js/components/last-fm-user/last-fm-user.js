import * as Web from '../web.js';
import LastFM from '../../lastfm.js';


class LastFmUser extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      name: '',
      profileImageSrc: '',
      profileImageSrcSet: ''
    };
  }

  static get observedAttributes () {
    return ['user'];
  }

  async componentDidUpdate () {
    const userInfo = await LastFM['User.getInfo'](this.props.user);
    const profileImageSrcSet = userInfo.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

    this.state = {
      name: userInfo.realname || userInfo.name,
      profileImageSrc: userInfo.image[0].url,
      profileImageSrcSet
    };
  }

  async componentDidMount () {
    const userInfo = await LastFM['User.getInfo'](this.props.user);
    const profileImageSrcSet = userInfo.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

    this.state = {
      name: userInfo.realname,
      profileImageSrc: userInfo.image[0].url,
      profileImageSrcSet
    };
  }

  render () {
    return Web.html`
      <figure>
        <img
          src="${this.state.profileImageSrc}"
          srcset="${this.state.profileImageSrcSet}"
          sizes="80px"
          alt="Profile image"
        >
      </figure>
      <span>${this.state.name} is listening to:</span>
    `;
  }
}

export default Web.registerComponent(LastFmUser);
