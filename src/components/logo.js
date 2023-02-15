import Image from "next/image";

export default function Logo({ height, width, margintop, marginbottom, marginleft, marginright }) {
    const style = {marginTop: margintop, marginBottom: marginbottom, marginLeft: marginleft, marginRight: marginright};
    return (
        <div style={style}>
            <Image src="/tapewinder_whitebg.png" alt="tapewinder icon" height={height} width={width} draggable="false" />
        </div>
    );
}

Logo.defaultProps = {
    margintop: "unset",
    marginbottom: "unset",
    marginleft: "unset",
    marginright: "unset"
};