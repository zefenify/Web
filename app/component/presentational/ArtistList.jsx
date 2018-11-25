import React, { Fragment } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Link } from 'react-router-dom';


const ArtistList = ({ artist }) => (
  <Fragment>
    {
      artist.map((_artist, index) => (
        <Link to={`/artist/${_artist.artist_id}`} key={_artist.artist_id}>
          <span>{_artist.artist_name}</span>{ (artist.length > 1 && (index < artist.length - 1)) ? <span>{ (index < artist.length - 2) ? <span>,</span> : <span>&nbsp;&amp;</span> } </span> : null }
        </Link>
      ))
    }
  </Fragment>
);

ArtistList.propTypes = {
  artist: arrayOf(shape({})),
};

ArtistList.defaultProps = {
  artist: [],
};

export default ArtistList;
