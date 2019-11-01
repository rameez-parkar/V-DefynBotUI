import { Component, OnInit, Input } from "@angular/core";
<<<<<<< HEAD
import { ComponentFactoryService } from 'src/app/services/ComponentFactory.service';
import { AppService } from 'src/app/services/app.service';
import { StateService } from 'src/app/services/state.service';
=======
import { ComponentFactoryService } from "src/app/services/ComponentFactory.service";
import { AppService } from "src/app/services/app.service";
>>>>>>> a8761a317b12a4d8987b494618d19f672488a048

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  constructor(private _componentFactoryService: ComponentFactoryService,
    private _appService: AppService,
    private _stateService: StateService) {}

  @Input() data: string;
  activeSlideIndex = 0;

  ngOnInit() {}

  ngAfterViewInit() {
    this._componentFactoryService.updateScroll();
  }

  proceedForBooking() {
    //this._appService.IntentRouter("Proceed Booking",null);
    let requestString = "swimming";
    let BookTableData = this._stateService.getBookTableData();
 
    if(BookTableData["guestCount"]!=""){
      requestString += " for "+BookTableData["guestCount"]+" people";
    }
    if(BookTableData["date"]!=""){
      requestString += " on "+BookTableData["date"].split("T")[0];
    }
    if(BookTableData["time"]!=""){
      let time:string =BookTableData["time"].split("T")[1];
      requestString += " at "+time.split("+")[0];
    }
    
    this._appService.IntentProcessing(requestString);
  }

  showRestaurantList() {
    this._appService.IntentRouter("Show Carousel Again", null);
  }
}
