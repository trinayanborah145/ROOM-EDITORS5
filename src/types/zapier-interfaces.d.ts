import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'chatbot-id'?: string;
          'is-popup'?: 'true' | 'false';
          height?: string;
          width?: string;
        },
        HTMLElement
      >;
    }
  }
}
