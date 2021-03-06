import { DialogTitle, ListItemText } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import { Dialog, List, ListItem, TextField } from "material-ui"
import * as React from "react"
import { Link } from "react-router-dom"
import { IBlock, IHyconWallet, IRest } from "./rest"
import { WalletList } from "./walletList"

export class WalletView extends React.Component<any, any> {
    public mounted: boolean = false
    public msg1: string = "Successfully saved"
    public msg2: string = "Successfully deleted"
    public msg3: string = "Fail to update favorites"
    public errMsg1: string = "Please enter 'Alias' and 'Address' together"
    public errMsg2: string = "Fail to save favorite"
    constructor(props: any) {
        super(props)
        this.state = {
            address: "",
            alias: "",
            dialog1: false,
            dialog2: false,
            favorites: [],
            redirect: false,
            rest: props.rest,
        }
    }
    public componentDidMount() {
        this.mounted = true
        this.state.rest.setLoading(true)
        this.state.rest.getFavoriteList().then((data: Array<{ alias: string, address: string }>) => {
            this.state.rest.setLoading(false)
            if (this.mounted) {
                this.setState({ favorites: data })
            }
        })
    }
    public componentWillUnmount() {
    }
    public handleInputChange(event: any) {
        const name = event.target.name
        const value = event.target.value
        if (name === "alias") {
            this.setState({ alias: value })
        } else if (name === "addr") {
            this.setState({ address: value })
        }
    }
    public addFavorite() {
        if (this.state.alias === "" || this.state.address === "") {
            alert(this.errMsg1)
        } else {
            this.state.rest.addFavorite(this.state.alias, this.state.address).then((data: boolean) => {
                if (data) {
                    alert(this.msg1)
                    window.location.reload()
                    this.setState({ dialog1: true })
                } else {
                    alert(this.errMsg2)
                }
            })
        }
    }
    public render() {
        return (
            <div>
                <div className="walletViewBtnDiv">
                    <button onClick={() => { this.setState({ dialog1: true }) }} className="mdl-button"><i className="material-icons">star</i> FAVORITES</button>
                    <button className="mdl-button">
                        <Link to="/wallet/addWallet" className="coloredBlack"><i className="material-icons">note_add</i> ADD WALLET</Link>
                    </button>
                    <button className="mdl-button">
                        <Link to="/wallet/recoverWallet" className="coloredBlack"><i className="material-icons">input</i> RECOVER WALLET</Link>
                    </button>
                </div>
                <div>
                    <WalletList rest={this.state.rest} />
                </div>

                {/* FAVORITES */}
                <Dialog open={this.state.dialog1}>
                    <h3 style={{ color: "grey", textAlign: "center" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>star</Icon>Favorite Addresses</h3>
                    <div style={{ margin: "0 auto", width: "50%" }}>
                        {/* <div className="mdl-dialog__content dialogContent"> */}
                        {(this.state.favorites.length === 0)
                            ? (<h5 style={{ color: "grey", textAlign: "center" }}>No favorite address</h5>)
                            : (<h5 style={{ color: "grey", textAlign: "center" }}>Click you want to delete</h5>)
                        }
                        <List>
                            {this.state.favorites.map((favorite: { alias: string, address: string }) => (
                                <ListItem onClick={() => { this.handleListItemClick(favorite.alias) }} key={favorite.alias}>
                                    <Grid container direction={"row"} justify={"center"} alignItems={"center"}>
                                        <Icon style={{ color: "grey" }}>person</Icon>
                                        <ListItemText primary={favorite.alias} secondary={favorite.address} />
                                    </Grid>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                        <Button variant="raised" onClick={() => { this.setState({ dialog2: true }) }} style={{ backgroundColor: "#50aaff", color: "white", float: "right", margin: "0 10px" }}>
                            <span style={{ marginRight: "10px" }}>ADD</span><Icon>add</Icon>
                        </Button>
                        <Button variant="raised" onClick={() => { this.setState({ dialog1: false }) }} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", float: "right" }}>
                            <span style={{ marginRight: "5px" }}>Cancel</span><Icon>close</Icon>
                        </Button>
                    </Grid>
                </Dialog>

                {/* ADD FAVORITE */}
                <Dialog className="dialog" open={this.state.dialog2}>
                    <h3 style={{ color: "grey" }}><Icon style={{ transform: "rotate(-25deg)", marginRight: "10px", color: "grey" }}>star</Icon>Add Favorite</h3>
                    <div className="mdl-dialog__content dialogContent">
                        <p>Add your favorite address with alias</p>
                        <div>
                            <TextField name="alias" floatingLabelText="Alias" floatingLabelFixed={true} type="text"
                                value={this.state.alias}
                                onChange={(data) => { this.handleInputChange(data) }} />
                            <TextField name="addr" floatingLabelText="Address" floatingLabelFixed={true} type="text"
                                value={this.state.address}
                                onChange={(data) => { this.handleInputChange(data) }} />
                        </div>
                    </div>
                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"flex-end"}>
                        <Button variant="raised" onClick={() => { this.addFavorite() }} style={{ backgroundColor: "#50aaff", color: "white", float: "right", margin: "0 10px" }}>
                            <span style={{ marginRight: "10px" }}>Save</span><Icon>star</Icon>
                        </Button>
                        <Button variant="raised" onClick={() => { this.setState({ dialog2: false }) }} style={{ backgroundColor: "rgb(225, 0, 80)", color: "white", float: "right" }}>
                            <span style={{ marginRight: "5px" }}>Cancel</span><Icon>close</Icon>
                        </Button>
                    </Grid>
                </Dialog>
            </div>
        )
    }
    private handleListItemClick(alias: string) {
        if (confirm(`Are you sure delete ${alias} from favorites?`)) {
            this.state.rest.deleteFavorite(alias).then((res: boolean) => {
                res ? alert(this.msg2) : alert(this.msg3)
                window.location.reload()
            })
        }
    }
}
