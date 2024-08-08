import { POKEMON_TYPES, POKEMON_ATTRIBUTES } from './data';
import { Box } from '@mui/material';
import styles from './Card.module.scss';
import { staticData, findByTypeAndLevel } from 'utils/racer-car-data';
import { maskAddress } from 'src/utils/maskAddress';

const mapRarity = (level) => {
  const rarityValue = parseInt(level, 10);
  if (rarityValue <= 10) {
    return 'Newbie';
  } else if (rarityValue <= 80) {
    return 'Amateur';
  } else if (rarityValue <= 95) {
    return 'Professional';
  } else {
    return 'Legendary';
  }
};

const Card = ({ userAttributes = POKEMON_ATTRIBUTES, data, isLoading = false }) => {
  const isEmpty = !userAttributes && !userImage && !isLoading;

  const attributes = userAttributes || POKEMON_ATTRIBUTES;

  const type = attributes.type?.toLowerCase();
  const AddOn = attributes.AddOn?.toLowerCase();
  const Fuel = attributes.Fuel?.toLowerCase();
  const name = data?.address ? maskAddress(data?.address) : '';
  const carInfo = findByTypeAndLevel('car', data?.carLevel ?? 0);
  const fuelInfo = findByTypeAndLevel('gas', data?.gasLevel);
  const equipmentInfo = findByTypeAndLevel('wheels', data?.wheelsLevel);

  const image = carInfo?.imageUrl ? carInfo.imageUrl : '/racer-car-elements/car-0.png';

  const level = Math.floor(Math.sqrt(data.totalScore / 100));
  const rarity = mapRarity(level);

  const { Icon: IconType, color: colorType } = POKEMON_TYPES[type] || POKEMON_TYPES['ground'];
  const { Icon: IconAddOn, color: colorAddOn } = POKEMON_TYPES[AddOn] || POKEMON_TYPES['default'];
  const { Icon: IconFuel, color: colorFuel } = POKEMON_TYPES[Fuel] || POKEMON_TYPES['default'];

  return (
    <div className={styles.card} data-is-empty={isEmpty}>
      <span className={styles.cardContent} style={{ backgroundColor: colorType }}>
        <span className={styles.cardHead}>
          <span>
            <span className={styles.cardSubType}>{rarity}</span>
            <span className={styles.cardName}>{attributes?.name}</span>
          </span>
          <span>
            <span className={styles.cardHp}>
              <span>Level</span>
              {level}
            </span>
          </span>
        </span>
        <span className={styles.cardImage} data-is-loading={isLoading}>
          <img src={image} />
        </span>
        <span className={styles.cardAttributes}>{carInfo.name}</span>
        <span className={styles.cardPower} style={{ fontFamily: 'Aldrich' }}>
          <strong>{}</strong> {carInfo.specialEffects}
        </span>
        <span className={styles.cardAttack} style={{ fontFamily: 'Aldrich' }}>
          <span style={{ fontFamily: 'Aldrich' }}>
            <strong>Highest Score</strong> {data?.points}
          </span>
          <span className={styles.cardAttackHp}>{data?.totalScore}</span>
        </span>
        <span className={styles.cardInteractions}>
          <span className={styles.cardAddOn}>
            <span className={styles.cardInteractionTitle}>AddOn</span>
            <span className={styles.cardAddOnIcon} style={{ backgroundColor: colorAddOn }}>
              <Box>
                {equipmentInfo ? (
                  <img src={equipmentInfo.imageUrl} className={styles.fancyBorder} height='50px' />
                ) : (
                  <div className={styles.vacantBox} style={{ height: '50px', width: '50px' }}></div>
                )}
              </Box>
            </span>
          </span>
          <span className={styles.cardFuel}>
            <span className={styles.cardInteractionTitle}>Fuel</span>
            <span className={styles.cardFuelIcon} style={{ backgroundColor: colorFuel }}>
              <Box>
                {fuelInfo ? (
                  <img src={fuelInfo.imageUrl} className={styles.fancyBorder} height='50px' />
                ) : (
                  <div className={styles.vacantBox} style={{ height: '50px', width: '50px' }}></div>
                )}
              </Box>
            </span>
          </span>
          <span className={styles.cardRetreatCost}>
            <span className={styles.cardInteractionTitle}>Star</span>
            {/* <span className='sr-only'>{attributes?.retreatCost}</span> */}
            <div>
              {[...new Array(attributes?.retreatCost)].map((_, i) => {
                return (
                  <span key={i} className={styles.cardRetreatCostIcon}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='156'
                      height='178'
                      fill='none'
                      viewBox='0 0 156 178'
                    >
                      <path
                        fill='#000'
                        d='M68.477 7.735c2.967-9.266 16.079-9.266 19.046 0l10.573 33.012a10 10 0 0011.644 6.723l33.876-7.35c9.508-2.063 16.064 9.292 9.523 16.495l-23.303 25.663a10 10 0 000 13.444l23.303 25.663c6.541 7.203-.015 18.558-9.523 16.495l-33.876-7.35a10 10 0 00-11.644 6.723l-10.573 33.012c-2.967 9.266-16.079 9.266-19.046 0l-10.573-33.012a10 10 0 00-11.644-6.723l-33.875 7.35c-9.51 2.063-16.065-9.292-9.524-16.495l23.303-25.663a10 10 0 000-13.444L2.86 56.615c-6.541-7.203.015-18.558 9.523-16.495l33.876 7.35a10 10 0 0011.644-6.723L68.476 7.735z'
                      ></path>
                    </svg>
                  </span>
                );
              })}
            </div>
          </span>
        </span>
      </span>
    </div>
  );
};

export default Card;
