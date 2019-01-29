import * as React from "react";
import SparqlWidget, {PublicProps} from "../SparqlWidget";
import Chart from "react-apexcharts";
import LD from "ld-query";
import VocabularyUtils from "../../../util/VocabularyUtils";
import defaultChartOptions from "../DefaultTermCharacteristicsFrequencyChartOptions";

interface Props extends PublicProps {
    notFilled: string,
    lang: string
}

class TermTypeFrequency extends React.Component<Props> {

    private cx = LD({"p": VocabularyUtils.PREFIX, "rdfs": VocabularyUtils.PREFIX_RDFS});

    private getLabel(res: any, iri: string) {
        if ((VocabularyUtils.PREFIX + "not-filled") === iri) {
            return this.props.notFilled;
        }
        const labels = this.cx(res).queryAll("[@id=" + iri + "] rdfs:label")
        for (const label of labels) {
            const q = label.query("@language");
            if (q && (q.json() === this.props.lang)) {
                return label.query("@value")
            }
        }
        return this.cx(res).query("[@id=" + iri + "] rdfs:label @value");
    }

    public render() {
        const TermTypeFrequencyI = this;
        const queryResult = this.props.queryResults;
        if (!queryResult || !queryResult.result) {
            return <div/>
        }

        const res = queryResult.result;
        const types: object = {};
        const fixedTypes=[
            "https://slovník.gov.cz/základní/pojem/objekt"
            , "https://slovník.gov.cz/základní/pojem/typ-objektu"
            , "https://slovník.gov.cz/základní/pojem/typ-vlastnosti"
            , "https://slovník.gov.cz/základní/pojem/typ-vztahu"
            , "https://slovník.gov.cz/základní/pojem/typ-události"
            , "https://slovník.gov.cz/základní/pojem/událost"
            , "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/not-filled"];
        fixedTypes.forEach(t => types[t] = TermTypeFrequencyI.getLabel(res, t) || t);
        // TermTypeFrequencyI.cx(res).queryAll("@type").forEach((t: any) => {
        //     if (!types[t[0]]) {
        //         types[t[0]] = TermTypeFrequencyI.getLabel(res, t[0]) || t[0];
        //     }
        // })
        const vocabularies = {};
        res.filter((r: any) => {
            return r[VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU] !== undefined;
        }).forEach((r: any) => {
            const voc = r[VocabularyUtils.JE_POJMEM_ZE_SLOVNIKU][0];
            const vocabulary = voc["@id"];
            let vocO = vocabularies[vocabulary];
            if (!vocO) {
                vocO = {name: TermTypeFrequencyI.getLabel(res, vocabulary)};
                Object.keys(types).forEach(type => {
                    vocO[types[type]] = 0
                })
                vocabularies[vocabulary] = vocO;
            }

            const curType = (r["@type"] || ["http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/not-filled"]);
            curType.forEach( (tt : any) => {
                vocO[types[tt]] = vocO[types[tt]] + 1 || 1;
            });
        })

        const series = Object.keys(types).map(t => {
            return {
                name: types[t],
                data: Object.keys(vocabularies).map(v => vocabularies[v][types[t]])
            }
        });

        const options = Object.assign(defaultChartOptions, {
            xaxis: {
                categories: Object.keys(vocabularies).map(v => vocabularies[v].name)
            },
        });

        return <Chart options={options}
                      series={series}
                      type="bar"
                      width="100%"
                      height="430px"/>
    }
}

export default SparqlWidget(TermTypeFrequency);
