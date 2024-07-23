import { FC, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { initFecha } from '../../utils';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Props {
    selectData: (dato: Value) => void;
}

export const CalendarCola: FC<Props> = ({ selectData }) => {

    const [date, setDate] = useState<Value>(initFecha.mindata());

    const onChangeFe = (date: Value) => {
        setDate(date);
        selectData(date)
    }

    return (
        <div>
            <Calendar onChange={onChangeFe} value={date} minDate={initFecha.mindata()} locale="es-ES" />
        </div>
    );
}
