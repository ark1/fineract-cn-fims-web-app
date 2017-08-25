/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, OnInit} from '@angular/core';
import {BalanceSegmentSet} from '../../../../services/portfolio/domain/balance-segment-set.model';
import {PortfolioStore} from '../../store/index';
import * as fromPortfolio from '../../store'
import {Observable} from 'rxjs/Observable';
import {RangeActions} from '../../store/ranges/range.actions';
import {ActivatedRoute} from '@angular/router';
import {TdDialogService} from '@covalent/core';
import {FimsProduct} from '../../store/model/fims-product.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './range.detail.component.html'
})
export class ProductChargeRangeDetailComponent implements OnInit {

  private productSubscription: Subscription;

  private product: FimsProduct;

  range$: Observable<BalanceSegmentSet>;

  constructor(private portfolioStore: PortfolioStore, private route: ActivatedRoute, private dialogService: TdDialogService) {}

  ngOnInit(): void {
    this.productSubscription = this.portfolioStore.select(fromPortfolio.getSelectedProduct)
      .filter(product => !!product)
      .subscribe(product => this.product = product);

    this.range$ = this.portfolioStore.select(fromPortfolio.getSelectedProductChargeRange)
      .filter(range => !!range);
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to this range?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE RANGE',
    }).afterClosed();
  }

  deleteRange(resource: BalanceSegmentSet): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.portfolioStore.dispatch(RangeActions.deleteAction({
          resource,
          data: {
            productIdentifier: this.product.identifier,
            activatedRoute: this.route
          }
        }))
      });
  }
}
