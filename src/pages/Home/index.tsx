import React, { useEffect, useState } from 'react';
import { FaGithub, FaCircleNotch } from 'react-icons/fa';

import getDominantColor from '../../utils/getColor';

import economia from '../../services/economia';
import pokeapi from '../../services/pokemon';

import './styles.scss';

interface Pokemon {
  id: number;
  name: string;
  baseStats: {
    speed: string;
    specialDefense: string;
    specialAttack: string;
    defense: string;
    attack: string;
    hp: string;
  };
}

interface Option {
  currency: string;
  label: string;
}

const Home: React.FC = () => {
  const [currency, setCurrency] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<Option>({
    currency: 'USD',
    label: 'Dolar',
  });
  const [pokemon, setPokemon] = useState<Pokemon>();

  useEffect(() => {
    const getDolar = async () => {
      const { data } = await economia.get(`${option?.currency}-BRL`);

      const formatDolar = parseFloat(data[option?.currency].ask).toFixed(2);

      setCurrency(formatDolar);
      setImage(
        `https://pokeres.bastionbot.org/images/pokemon/${formatDolar.replace(
          '.',
          '',
        )}.png`,
      );

      if (image !== '') {
        const hexadecimal = await getDominantColor(image);

        const body = document.getElementsByTagName('body')[0];
        body.style.backgroundColor = hexadecimal.Vibrant!.hex;
      }
    };

    getDolar();
  }, [image, option]);

  useEffect(() => {
    const getPokemon = async () => {
      setLoading(true);
      const { data } = await pokeapi.get(
        `pokemon/${currency.replace('.', '')}`,
      );
      const { id, name, stats } = data;

      const baseStats = {
        speed: stats[0]?.base_stat,
        specialDefense: stats[1]?.base_stat,
        specialAttack: stats[2]?.base_stat,
        defense: stats[3]?.base_stat,
        attack: stats[4]?.base_stat,
        hp: stats[5]?.base_stat,
      };

      setPokemon({ id, name, baseStats });
      setLoading(false);
    };

    if (currency !== '') getPokemon();
  }, [currency]);

  return (
    <>
      <nav>
        <div>
          <button
            type="button"
            onClick={() => setOption({ currency: 'USD', label: 'Dolar' })}
          >
            Dolar
          </button>
          <button
            type="button"
            onClick={() => setOption({ currency: 'EUR', label: 'Euro' })}
          >
            Euro
          </button>
        </div>
        <span>
          <p>Give me star</p>
          <a
            href="http://github.com/melquisedecfelipe/pokecurrency"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </span>
      </nav>
      <main>
        <section>
          <div>
            <p>
              #{pokemon?.id} | {option.label} para Real
            </p>
            <h2>{pokemon?.name}</h2>
            <h1>
              valor R$<span>{currency.replace('.', ',')}</span>
            </h1>
          </div>
          <div>
            <p>Base:</p>
            <div className="base-stats">
              <p>HP: {pokemon?.baseStats?.hp}</p>
              <p>Ataque: {pokemon?.baseStats?.attack}</p>
              <p>Defesa: {pokemon?.baseStats?.defense}</p>
              <p>SP. Ataque: {pokemon?.baseStats?.specialAttack}</p>
              <p>SP. Defesa: {pokemon?.baseStats?.specialDefense}</p>
              <p>Velocidade: {pokemon?.baseStats?.speed}</p>
            </div>
          </div>
        </section>
        {currency !== '' && loading === false ? (
          <img src={image} alt={pokemon?.name} />
        ) : (
          <span className="load">
            <FaCircleNotch />
          </span>
        )}
      </main>
    </>
  );
};

export default Home;
