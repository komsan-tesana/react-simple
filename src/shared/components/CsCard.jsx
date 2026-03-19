
import { Card } from 'antd';

export function CsCard ({data,content,classNameCard}) {  
 return ( <Card
    className={classNameCard || undefined}
    hoverable
    cover={
      <img
        loading='eager'
        draggable={false}
        alt={data.url || null}
        src={data.url || null}
      />
    }
    children={content}
  />)
};
