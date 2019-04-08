import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TableModel} from "frontend-core/dist/pbs-table";
import * as _ from 'lodash';
import {IDonation} from "../donation/donation-data.service";
import {PickupRequestTableConfig} from "./pickup-request-table.config";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {filter, map, shareReplay, startWith, switchMap, take, tap, withLatestFrom} from "rxjs/operators";
import {isValidLoaded, RemoteData} from "frontend-core/remote-data";
import {CorporationDataService, ICorporation} from "../corporation/corporation-data.service";
import {FormControl, FormGroup} from "@angular/forms";
import {IRemoteList} from "frontend-core/dist/entity-data-service";
import {PickupRequestDataService} from "./pickup-request-data.service";
import {isLoading} from "frontend-core/dist/remote-data";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MatSnackBar} from "@angular/material";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-pickup-request',
  templateUrl: './pickup-request.component.html',
  styleUrls: ['./pickup-request.component.scss']
})
export class PickupRequestComponent implements OnInit {

  public formGroup = new FormGroup({
    corporation: new FormControl(),
  });

  public tableModel: TableModel<IDonation>;

  public instructions: string;

  protected requestPickup$ = new Subject();
  protected refresh$ = new BehaviorSubject(true);
  protected cancelPickup$ = new Subject();
  protected updateInstructionsClick$ = new Subject<string>();

  public getCorporations$: Observable<RemoteData<IRemoteList<ICorporation>>> =
    this.refresh$
      .pipe(
        switchMap(() => this
          .corporationDataService
          .getMany()
          .pipe(
            shareReplay(1),
          ))
      )
  ;

  public corporations$: Observable<ICorporation[]> =
    this
      .getCorporations$
      .pipe(
        filter(isValidLoaded),
        // map(data => _.sortBy(data.items, ['name'])),
        map(data => data.items),
        shareReplay(1),
      )
  ;

  public currentCorporation$: Observable<ICorporation> =
      this.refresh$
        .pipe(
          switchMap(() =>
            Observable.combineLatest(
              this.corporations$,
              this.formGroup.valueChanges
            )
              .pipe(
                filter(isValidLoaded),
                map(([corps, {corporation}]) => _.find(corps, {id: corporation})),
                tap(data => data && (this.instructions = data.instructions)),
              )
          ),
          shareReplay(1),
        )
  ;

  public updateInstructions$ =
    this.updateInstructionsClick$
      .pipe(
        withLatestFrom(this.currentCorporation$),
        switchMap(([instructions, corporation]) => this.corporationDataService.updateInstructions(corporation.id, instructions)),
      );

  public currentPickupRequest$ =
    Observable.merge(
      this.currentCorporation$
        .pipe(
          switchMap(corporation => this.pickupRequestDataService.getActive(corporation.id)),
          shareReplay(1),
        ),
      this.requestPickup$
        .pipe(
          withLatestFrom(this.currentCorporation$),
          switchMap(([, corp]) => this.pickupRequestDataService.createOne(corp.id)),
          shareReplay(1)
        ),
      this.cancelPickup$
        .pipe(
          withLatestFrom(this.currentCorporation$),
          switchMap(([, corp]) => this.pickupRequestDataService.deleteOne(corp.id)),
          shareReplay(1)
        )
    )
  ;

  public currentPickupRequestDate$: Observable<string> =
    this.currentPickupRequest$
      .pipe(
        filter(isValidLoaded),
        map(request => {
          if (!request) {
            return null;
          }
          return request.createdAt;
        }),
        shareReplay(1),
      )
  ;

  public currentPickupRequestStatus$: Observable<string> =
    this.currentPickupRequest$
      .pipe(
        filter(isValidLoaded),
        map(request => {
          if (!request) {
            return null;
          }
          return request.status;
        }),
        shareReplay(1),
      )
  ;

  public currentPickupRequestDonations$: Observable<IDonation[]> =
    this.currentPickupRequest$
      .pipe(
        filter(isValidLoaded),
        map(request => {
          if (!request) {
            return [];
          }
          return request.donationTables;
        }),
        shareReplay(1),
      )
  ;

  public courierUsername$ =
    this.currentPickupRequest$
      .pipe(
        filter(isValidLoaded),
        map(request => {
          if (!request) {
            return null;
          }
          return request.courierFullName;
        }),
        shareReplay(1),
      )

  public pickedUpCount$ =
    this.currentPickupRequestDonations$
      .pipe(
        map(data => {
          if (!data || !data.length) {
            return 0;
          }
          return data.filter(item => item.deliveryStatus === 'Delivery' || item.deliveryStatus === 'Archived').length
        }),
        startWith(0)
      );

  public notFoundCount$ =
    this.currentPickupRequestDonations$
      .pipe(
        map(data => {
          if (!data || !data.length) {
            return 0;
          }
          return data.filter(item => item.deliveryStatus === 'Voided').length
        }),
        startWith(0)
      );

  public selectedIndex$: Observable<number> =
    this.currentPickupRequestStatus$
      .pipe(
        map(status => {
          switch (status) {
            case 'created': return 0;
            case 'assigned': return 1;
            case 'complete': return 2;
            default: return 3;
          }
        }),
        shareReplay(1),
      )
  ;

  public loading$ =
    this.currentPickupRequest$
      .pipe(
        map(data => isLoading(data)),
        startWith(true)
      )
  ;

  constructor(
    protected corporationDataService: CorporationDataService,
    protected pickupRequestTableConfig: PickupRequestTableConfig,
    protected pickupRequestDataService: PickupRequestDataService,
    protected snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.tableModel = this.pickupRequestTableConfig.createTableModel(
      (...args) => {
        return Observable.combineLatest(
          this.currentCorporation$,
          Observable.of(args)
        )
          .pipe(
            switchMap(([corp, args]) => this.corporationDataService.getDonations(Object.assign(args[1], {corporationId: corp.id}), this.corporationDataService.donationsProjection))
          )
      }
    );
    this.corporations$.subscribe(data => {
      if (!this.formGroup.value.corporation) {
        this.formGroup.controls['corporation'].patchValue(data[0].id)
      }
    });
    this.updateInstructions$.filter(isValidLoaded).subscribe(() => {
      this.snackBar.open('Changes saved.');
      this.refresh$.next(true);
    })
  }

  updateInstructions() {
    this.updateInstructionsClick$.next(this.instructions);
  }

  requestPickup() {
    this.requestPickup$.next(true);
  }

  cancelPickup() {
    this.cancelPickup$.next(false);
  }

}
