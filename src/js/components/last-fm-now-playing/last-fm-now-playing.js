import { registerFunctionComponent } from 'https://unpkg.com/webact';
import LastFM from '../../lastfm.js';
import { setStatus, resetStatusesFromBeforeScrobbling } from '../../slack.js';

function LastFmNowPlaying ({ user }) {
  const { $, html, css, propsChanged, postRender } = this;
  let nowPlaying;

  css`
  :host {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 2rem 0;
    height: 96px;
  }

  figure {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    display: block;
    width: 96px;
    height: 96px;
    border-radius: 12px;
  }

  .col {
    margin-left: 2rem;
  }

  span {
    display: block;
    font-size: 1rem;
  }

  span:first-child {
    font-weight: 600;
  }
  `;

  html`
    <figure>
      <img sizes="128px" alt="Profile image">
    </figure>
    <div class="col">
      <span></span>
      <span></span>
    </div>
  `;

  async function update () {
    const img = $('img');
    const titleSpan = $('span:first-child');
    const artistSpan = $('span:last-child');
    const scrobblingTrack = await LastFM['User.getScrobblingTrack'](user);

    if (nowPlaying && nowPlaying.url === scrobblingTrack.url) {
      return;
    }

    if (scrobblingTrack) {
      nowPlaying = scrobblingTrack;
      const coverImageSrcSet = scrobblingTrack.image.map(({ url, size }) => `${url} ${size}w`).join(', ');

      setStatus(`${scrobblingTrack.artist} - ${scrobblingTrack.title}`).then(console.log);

      img.src = scrobblingTrack.image[0].url;
      img.srcset = coverImageSrcSet;
      titleSpan.textContent = scrobblingTrack.title;
      artistSpan.textContent = scrobblingTrack.artist;
    } else {
      resetStatusesFromBeforeScrobbling();
    }
  }

  propsChanged(update);

  postRender(() => {
    update();
    setInterval(update, 5000);
  });
}

export default registerFunctionComponent(LastFmNowPlaying, {
  name: 'last-fm-now-playing',
  observedAttributes: ['user']
});
