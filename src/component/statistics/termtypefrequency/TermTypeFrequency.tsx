import * as React from "react";
import SparqlWidget, {PublicProps} from "../SparqlWidget";
import Chart from "react-apexcharts";
import LD from "ld-query";
import VocabularyUtils from "../../../util/VocabularyUtils";
import defaultChartOptions from "../DefaultTermCharacteristicsFrequencyChartOptions";
import withInjectableLoading from "../../hoc/withInjectableLoading";

const TYPE_NOT_FILLED = "http://onto.fel.cvut.cz/ontologies/slovnik/agendovy/popis-dat/pojem/not-filled";

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
        const labels = this.cx(res).queryAll("[@id=" + iri + "] rdfs:label");
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
            return <div>{this.props.renderMask()}</div>;
        }

        const res = queryResult.result;
        const types: object = {};
        const fixedTypes = ["https://slovník.gov.cz/základní/pojem/objekt",
            "https://slovník.gov.cz/základní/pojem/typ-objektu",
            "https://slovník.gov.cz/základní/pojem/typ-vlastnosti",
            "https://slovník.gov.cz/základní/pojem/typ-vztahu",
            "https://slovník.gov.cz/základní/pojem/typ-události",
            "https://slovník.gov.cz/základní/pojem/událost",
            TYPE_NOT_FILLED];
        fixedTypes.forEach(t => types[t] = TermTypeFrequencyI.getLabel(res, t) || t);

        const vocabularies = {};
        res.filter((r: any) => {
            return r[VocabularyUtils.IS_TERM_FROM_VOCABULARY] !== undefined;
        }).forEach((r: any) => {
            const voc = r[VocabularyUtils.IS_TERM_FROM_VOCABULARY][0];
            const vocabulary = voc["@id"];
            let vocO = vocabularies[vocabulary];
            if (!vocO) {
                vocO = {name: TermTypeFrequencyI.getLabel(res, vocabulary)};
                Object.keys(types).forEach(type => {
                    vocO[types[type]] = 0
                });
                vocabularies[vocabulary] = vocO;
            }

            let currType;
            if (r["@type"]) {
                currType = r["@type"];
            } else if (r[VocabularyUtils.RDF_TYPE]) {
                // GraphDB returns types as rdf:type property values
                currType = r[VocabularyUtils.RDF_TYPE].map((t: any) => t["@id"]);
            } else {
                currType = TYPE_NOT_FILLED;
            }

            let found = false;
            currType.forEach((tt: any) => {
                if (types[tt]) {
                    vocO[types[tt]] = vocO[types[tt]] + 1 || 1;
                    found = true;
                }
            });
            if (!found) {
                vocO[types[TYPE_NOT_FILLED]] += 1;
            }
        });

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
                      height="430px"/>;
    }
}

export default withInjectableLoading(SparqlWidget(TermTypeFrequency));
