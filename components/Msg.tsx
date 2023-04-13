import { classNames } from '@/helpers/ui'

export interface MsgProps {
    text: string
    self: boolean
    time: string
    loading?: boolean
    error?: boolean
}

export default function Msg({ text, self, time, loading, error }: MsgProps) {
    return (
        <div
            className={classNames({
                'p-4': true,
                'bg-slate-300': self,
                'bg-slate-50': !self,
            })}
        >
            <div className="flex justify-between">
                <p>{self ? 'You' : 'AI'}</p>
                <p>{loading ? '...' : time}</p>
            </div>
            <p className={classNames({
                'text-red-400': !!error
            })}>{text}</p>
        </div>
    )
}
