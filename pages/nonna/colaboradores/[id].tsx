import { GetServerSideProps, NextPage } from 'next';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CreditCardOffOutlined } from '@mui/icons-material';
import { IColaborador } from '../../../interface';
import { dbCola } from '../../../database';
import { ColaboradorDetail } from '../../../components';

interface Props { colaborador: IColaborador; }

const ColaboraPage: NextPage<Props> = ({ colaborador }) => {

    return (
        <AdminLayout
            title={'Colaborador'}
            subTitle='Mantenimiento de colaborador'
            icon={<CreditCardOffOutlined />}
        >
            <ColaboradorDetail colaborador={colaborador} />
        </AdminLayout >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { id = '' } = query;
    const data = await dbCola.getColaById(id.toString());

    if (!data) {
        return {
            redirect: {
                destination: '/nonna/colaboradores',
                permanent: false,
            }
        }
    }

    return {
        props: {
            colaborador: data
        }
    }
}

export default ColaboraPage;