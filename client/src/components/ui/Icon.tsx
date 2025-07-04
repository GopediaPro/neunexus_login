interface IconProps {
  name: string;
  style?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export const Icon = ({ name, style, ariaLabel = name, onClick }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={style} aria-label={ariaLabel} onClick={onClick}>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}