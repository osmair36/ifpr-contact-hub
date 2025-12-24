import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
    return (
        <a
            href="https://ifpr.edu.br/assis-chateaubriand/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o Site do Campus
        </a>
    );
};
