import { h } from 'preact';

function IconGraphDownArrow(props : any ) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M14 9.586l-4 4-6.293-6.293-1.414 1.414L10 16.414l4-4 4.293 4.293L16 19h6v-6l-2.293 2.293z" />
    </svg>
  );
}

export default IconGraphDownArrow;
